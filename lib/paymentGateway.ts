import { YooCheckout } from "@a2seven/yoo-checkout";
import { getSecret } from "./getSecret";

const yooMoneyShopId = getSecret("YOO_MONEY_SHOP_ID");
const yooMoneySecretId = getSecret("YOO_MONEY_SECRET_ID");

export default async function yooMoneyPaymentGateway() {
  return new YooCheckout({
    shopId: yooMoneyShopId,
    secretKey: yooMoneySecretId,
  });
}
