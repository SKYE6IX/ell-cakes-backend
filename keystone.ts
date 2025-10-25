import { config } from "@keystone-6/core";
import dotenv from "dotenv";
import express from "express";
dotenv.config({ override: true });
import { lists } from "./schema";
import { withAuth, session } from "./auth";
import { customExtendResolvers } from "./custom-resolver";
import { insertSeedData } from "./script";
import { confirmPayment } from "./custom-resolver/confirmPayment";

const {
  YC_S3_KEY_ID,
  YC_S3_SECRET_KEY,
  YC_S3_BUCKET,
  YC_S3_REGION,
  YC_S3_PRIVATE_ENDPOINT,
} = process.env;

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
      idField: { kind: "uuid" },
      onConnect: async (context) => {
        console.log("Database connected");
        if (process.argv.includes("--seed-data")) {
          await insertSeedData(context);
        }
      },
    },
    lists,
    session,
    storage: {
      yc_s3_image: {
        kind: "s3",
        type: "image",
        bucketName: `${YC_S3_BUCKET}-images`,
        region: YC_S3_REGION,
        accessKeyId: YC_S3_KEY_ID,
        secretAccessKey: YC_S3_SECRET_KEY,
        endpoint: YC_S3_PRIVATE_ENDPOINT,
        acl: "public-read",
      },
      yc_s3_files: {
        kind: "s3",
        type: "file",
        bucketName: `${YC_S3_BUCKET}-files`,
        region: YC_S3_REGION,
        accessKeyId: YC_S3_KEY_ID,
        secretAccessKey: YC_S3_SECRET_KEY,
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
