import { config } from "@keystone-6/core";
import dotenv from "dotenv";
import express from "express";
dotenv.config({ override: true });
import { lists } from "./schema";
import { withAuth, session } from "./auth";
import { customExtendResolvers } from "./custom-resolver";
import { confirmPayment } from "./custom-resolver/confirmPayment";
import { getSecret } from "./lib/getSecret";

const { YC_S3_BUCKET, YC_S3_REGION, YC_S3_PRIVATE_ENDPOINT } = process.env;

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
    },
    graphql: {
      extendGraphqlSchema: customExtendResolvers,
    },
    server: {
      port: 8080,
      extendExpressApp: (app, commonContext) => {
        app.use(express.json());
        app.post("/payment/payment-verification", async (req, res) => {
          const context = await commonContext.withRequest(req, res);
          await confirmPayment({ body: req.body, context: context });
          res.send("ok").status(200);
        });
      },
    },
  })
);
