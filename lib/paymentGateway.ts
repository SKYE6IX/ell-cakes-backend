import { YooCheckout } from "@a2seven/yoo-checkout";

export default async function yooMoneyPaymentGateway() {
  return new YooCheckout({
    shopId: process.env.YOO_MONEY_SHOP_ID,
    secretKey: process.env.YOO_MONEY_SECRET_ID,
  });
}
