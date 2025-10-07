interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly YC_S3_KEY_ID: string;
  readonly YC_S3_SECRET_KEY: string;
  readonly YC_S3_BUCKET: string;
  readonly YC_S3_REGION: string;
  readonly YC_S3_PRIVATE_ENDPOINT: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly GOOGLE_REFRESH_TOKEN: string;
  readonly FRONTEND_URL: string;
}
declare global {
  namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {}
  }
}
export {};
