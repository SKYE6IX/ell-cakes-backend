import { config } from "@keystone-6/core";
import dotenv from "dotenv";
dotenv.config();
import { lists } from "./schema";
import { withAuth, session } from "./auth";

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
    },
    lists,
    session,
    storage: {
      yc_s3_image: {
        kind: "s3",
        type: "image",
        bucketName: YC_S3_BUCKET,
        region: YC_S3_REGION,
        accessKeyId: YC_S3_KEY_ID,
        secretAccessKey: YC_S3_SECRET_KEY,
        endpoint: YC_S3_PRIVATE_ENDPOINT,
        acl: "public-read",
      },
    },
  })
);
