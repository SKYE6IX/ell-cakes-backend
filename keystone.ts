import { config } from "@keystone-6/core";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";
dotenv.config({ override: true });
import { lists } from "./schema";
import { withAuth, session } from "./auth";
import { customExtendResolvers } from "./custom-resolver";
import { confirmPayment } from "./custom-resolver/confirmPayment";
import { getSecret } from "./lib/getSecret";
import { pinoLogger } from "./lib/logger";

const { YC_S3_BUCKET, YC_S3_REGION, YC_S3_PRIVATE_ENDPOINT, FRONTEND_URL } =
  process.env;

const databaseUrl = getSecret("DATABASE_URL");
const ycS3KeyId = getSecret("YC_S3_KEY_ID");
const ycS3SecretId = getSecret("YC_S3_SECRET_KEY");

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: databaseUrl,
      idField: { kind: "uuid" },
    },
    lists,
    session,
    storage: {
      yc_s3_image: {
        kind: "s3",
        type: "image",
        bucketName: `${YC_S3_BUCKET}-images`,
        region: YC_S3_REGION,
        accessKeyId: ycS3KeyId,
        secretAccessKey: ycS3SecretId,
        endpoint: YC_S3_PRIVATE_ENDPOINT,
        acl: "public-read",
      },
      yc_s3_files: {
        kind: "s3",
        type: "file",
        bucketName: `${YC_S3_BUCKET}-files`,
        region: YC_S3_REGION,
        accessKeyId: ycS3KeyId,
        secretAccessKey: ycS3SecretId,
        endpoint: YC_S3_PRIVATE_ENDPOINT,
        acl: "public-read",
      },
      yc_s3_order_images: {
        kind: "s3",
        type: "image",
        bucketName: `${YC_S3_BUCKET}-order-images`,
        region: YC_S3_REGION,
        accessKeyId: ycS3KeyId,
        secretAccessKey: ycS3SecretId,
        endpoint: YC_S3_PRIVATE_ENDPOINT,
        acl: "public-read",
      },
    },
    graphql: {
      extendGraphqlSchema: customExtendResolvers,
      apolloConfig: {
        formatError(formattedError, error) {
          console.error("Here is the formatted error -> ", formattedError);
          return formattedError;
        },
        plugins: [
          {
            async requestDidStart() {
              const start = Date.now();
              return {
                async willSendResponse(requestContext) {
                  pinoLogger.logger.info(
                    {
                      req: requestContext.contextValue.req
                        ? { id: requestContext.contextValue.req?.id }
                        : undefined,
                      responseTime: Date.now() - start,
                      graphql: {
                        type: requestContext.operation?.operation,
                        name: requestContext.request.operationName,
                        errors:
                          requestContext.errors?.map((e) => ({
                            path: e.path,
                            message: e.message,
                          })) || undefined,
                      },
                    },
                    "graphql query completed"
                  );
                },
              };
            },
          },
        ],
      },
    },
    server: {
      cors: { origin: [FRONTEND_URL], credentials: true },
      port: 8080,

      extendExpressApp: (app, commonContext) => {
        app.use(pinoLogger);
        app.use(cookieParser());
        app.use(express.json());

        app.use("/api/graphql", async (req, res, next) => {
          if (!req.cookies["ell-cake-cart-id"]) {
            const cartId = randomUUID();
            res.cookie("ell-cake-cart-id", cartId, {
              httpOnly: true,
              sameSite: "lax",
              maxAge: 1000 * 60 * 60 * 24 * 30,
              secure: process.env.NODE_ENV === "production",
            });
          }
          next();
        });

        app.post("/payment/payment-verification", async (req, res) => {
          const context = await commonContext.withRequest(req, res);
          await confirmPayment({ body: req.body, context: context });
          res.send("ok").status(200);
        });
      },
    },
  })
);
