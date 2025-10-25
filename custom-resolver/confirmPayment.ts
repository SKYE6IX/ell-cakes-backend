import { Context } from ".keystone/types";
import yooMoneyPaymentGateway from "../lib/paymentGateway";

interface ConfirmPaymentArgs {
  body: any;
  context: Context;
}
export const confirmPayment = async ({ body, context }: ConfirmPaymentArgs) => {
  const yooMoneyWebHookData = body;
  if (yooMoneyWebHookData.object.status !== "succeeded") {
    return;
  }
  const yooMoney = await yooMoneyPaymentGateway();
  try {
    const payment = await yooMoney.getPayment(yooMoneyWebHookData.object.id);

    if (!payment) {
      return;
    }

    if (payment.status === "succeeded") {
      await context.prisma.payment.update({
        where: { paymentId: payment.id },
        data: {
          status: "succeeded",
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
