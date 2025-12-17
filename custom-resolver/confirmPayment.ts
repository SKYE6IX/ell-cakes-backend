import { Context } from ".keystone/types";
import { v4 as uuidv4 } from "uuid";
import { ICreateReceipt } from "@a2seven/yoo-checkout";
import yooMoneyPaymentGateway from "../lib/paymentGateway";
import { createOrder } from "./createOrder";
import { PaymentStatus } from "./checkOut";

interface ConfirmPaymentArgs {
  body: any;
  context: Context;
}

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
    } else if (payment.status === "canceled") {
      await sudoContext.db.Payment.updateOne({
        where: { yooMoneyId: payment.id },
        data: {
          status: PaymentStatus.CANCELED,
          updatedAt: new Date(),
        },
      });

      await sudoContext.db.OrderIntent.updateOne({
        where: { yooMoneyId: payment.id },
        data: {
          paymentStatus: PaymentStatus.CANCELED,
          updatedAt: new Date(),
        },
      });
    } else if (payment.status === "succeeded") {
      // Update the payment status to succeeded
      const updatedPayment = await sudoContext.db.Payment.updateOne({
        where: { yooMoneyId: payment.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Update OrderIntent status success
      const orderIntentUpdate = await sudoContext.db.OrderIntent.updateOne({
        where: { yooMoneyId: payment.id },
        data: {
          paymentId: updatedPayment.id,
          paymentStatus: PaymentStatus.SUCCEEDED,
          updatedAt: new Date(),
        },
      });

      // Create a new order
      const newOrder = await createOrder({
        orderIntent: orderIntentUpdate,
        context,
      });

      // console.log("A new created Order -> ", newOrder);

      // Send a receipt to USER about their payment
      // const idempotence_key = uuidv4();
      // const receiptPayload: ICreateReceipt = {
      //   customer: {
      //     full_name: order.user?.name,
      //     email: order.user?.email,
      //     phone: order.user?.phoneNumber,
      //   },
      //   payment_id: payment.id,
      //   type: "payment",
      //   send: true,
      //   items: order.orderItems.map((orderItem) => {
      //     return {
      //       description: orderItem.product?.name || "",
      //       quantity: String(orderItem.quantity),
      //       amount: {
      //         value: String(orderItem.subTotal),
      //         currency: "RUB",
      //       },
      //       vat_code: 2,
      //       payment_mode: "full_payment",
      //       payment_subject: "commodity",
      //     };
      //   }),
      //   settlements: [
      //     {
      //       type: "cashless",
      //       amount: { value: String(order.totalAmount), currency: "RUB" },
      //     },
      //   ],
      // };

      // const receipt = await yooMoney.createReceipt(
      //   receiptPayload,
      //   idempotence_key
      // );
      // console.log(receipt);

      // TODO:
      // Set up sms service that will send sms about the order to the USER
      // Use the payment ID to query the ORDER to get information about the order and the
      // User information.

      // 1. Send receipt email to user after a successful payment(Through Yookassa set up)

      // 2. Create an order for Merchant CRM using the values of all the order items.
      // ::::: 1. We need to update the order model, so we can store the ID of CRM order ID
      // :::::  we've just created.
      // ::::: 2. Another option is to send order details to merchant email with the help of nodemailer.
    }
  } catch (error) {
    console.error(
      "An error occur inside the payment notification web-hook -> ",
      error
    );
    return;
  }
};
