interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly DATABASE_SHADOW_URL: string;
  readonly YC_S3_KEY_ID: string;
  readonly YC_S3_SECRET_KEY: string;
  readonly YC_S3_BUCKET: string;
  readonly YC_S3_REGION: string;
  readonly YC_S3_PRIVATE_ENDPOINT: string;
  readonly FRONTEND_URL_PRIMARY: string;
  readonly FRONTEND_URL_SECONDARY: string;
  readonly YOO_MONEY_SHOP_ID: string;
  readonly YOO_MONEY_SECRET_ID: string;
  readonly SMS_SENDER: string;
  readonly SMS_API_KEY: string;
  readonly REDIS_HOST: string;
  readonly YANDEX_USER_MAIL_HOST: string;
  readonly YANDEX_USER_MAIL: string;
  readonly YANDEX_USER_MAIL_PASS: string;
  readonly SELLER_EMAIL: string;
}
declare global {
  namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {}
  }
}
export {};
