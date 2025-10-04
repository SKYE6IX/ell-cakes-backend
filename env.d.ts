interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly YC_S3_KEY_ID: string;
  readonly YC_S3_SECRET_KEY: string;
  readonly YC_S3_BUCKET: string;
  readonly YC_S3_REGION: string;
  readonly YC_S3_PRIVATE_ENDPOINT: string;
}
declare global {
  namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {}
  }
}
export {};
