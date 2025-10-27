import { Prisma } from "@prisma/client";
import { Context } from ".keystone/types";
import { v4 as uuidv4 } from "uuid";
import { ICreateReceipt } from "@a2seven/yoo-checkout";
import yooMoneyPaymentGateway from "../lib/paymentGateway";

interface ConfirmPaymentArgs {
  body: any;
  context: Context;
}

type OrderWithOrderDetails = Prisma.OrderGetPayload<{
  include: { orderItems: { include: { product: true } }; user: true };
}>;

export const confirmPayment = async ({ body, context }: ConfirmPaymentArgs) => {
  const yooMoneyWebHookData = body;
  const sudoContext = context.sudo();
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
      // Update the payment status to succeeded
      const updatePayment = await sudoContext.db.Payment.updateOne({
        where: { paymentId: payment.id },
        data: {
          status: "succeeded",
        },
      });
      // Query the current Order
      const order = (await sudoContext.query.Order.findOne({
        where: { payment: { id: updatePayment.id } },
        query: `id orderNumber totalAmount orderItems {id quantity subTotal product { name } } user { name email phoneNumber }`,
      })) as OrderWithOrderDetails;

      // Send a receipt to USER about their payment
      const idempotence_key = uuidv4();
      const receiptPayload: ICreateReceipt = {
        customer: {
          full_name: order.user?.name,
          email: order.user?.email,
          phone: order.user?.phoneNumber,
        },
        payment_id: payment.id,
        type: "payment",
        send: true,
        items: order.orderItems.map((orderItem) => {
          return {
            description: orderItem.product?.name || "",
            quantity: String(orderItem.quantity),
            amount: {
              value: String(orderItem.subTotal),
              currency: "RUB",
            },
            vat_code: 2,
            payment_mode: "full_payment",
            payment_subject: "commodity",
          };
        }),
        settlements: [
          {
            type: "cashless",
            amount: { value: String(order.totalAmount), currency: "RUB" },
          },
        ],
      };
      const receipt = await yooMoney.createReceipt(
        receiptPayload,
        idempotence_key
      );
      // console.log(receipt);
      // Set up a mail or sms sercie that will send email or sms about the order to the USER
      // Use the payment ID to query the ORDER to get information about the order and the
      // User.
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
