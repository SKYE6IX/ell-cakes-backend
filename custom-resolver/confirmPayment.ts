import { Context } from ".keystone/types";
import { v4 as uuidv4 } from "uuid";
import { ICreateReceipt } from "@a2seven/yoo-checkout";
import yooMoneyPaymentGateway from "../lib/paymentGateway";
import { createOrder } from "./createOrder";
import { PaymentStatus } from "./checkOut";
import {
  sendOrderNotification,
  sendNewOrderNotificationToSeller,
} from "../lib/mail";

interface ConfirmPaymentArgs {
  body: any;
  context: Context;
}

type SellerNewOrderNotification = {
  ordernumber: string;
  orderitems: {
    productname: string;
    productfilling: string;
    quantity: number;
    unitprice: number;
    subtotal: number;
  }[];
  totalamount: number;
  deliveryaddress: string;
  deliveryoption: string;
  paymentmethod: string;
  orderurl: string;
};

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

      return;
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
      const orderIntentUpdate = await sudoContext.prisma.orderIntent.update({
        where: { yooMoneyId: payment.id },
        data: {
          paymentId: updatedPayment.id,
          paymentStatus: PaymentStatus.SUCCEEDED,
          updatedAt: new Date(),
        },
        include: { deliveryAddress: true },
      });

      // Create a new order
      const newOrder = await createOrder({
        orderIntent: orderIntentUpdate,
        context,
      });

      // Get the user
      const user = await sudoContext.db.User.findOne({
        where: { id: newOrder?.userId },
      });

      // Set up new order email notification for user.
      if (user && newOrder) {
        await sendOrderNotification({
          to: user.email,
          orderNumber: newOrder.orderNumber,
        });
      }

      // Setting up mail delivery for admin on new order notification
      const orderItems = await sudoContext.prisma.orderItem.findMany({
        where: { orderId: { equals: newOrder?.id } },
        include: { product: true, variant: { include: { filling: true } } },
      });

      if (newOrder) {
        const orderUrl = `https://api.ellcakes.ru/orders/${newOrder.id}`;
        const newOrderForSellerData: SellerNewOrderNotification = {
          ordernumber: newOrder.orderNumber,
          orderitems: orderItems.map((oi) => ({
            productname: oi.product!.name,
            productfilling: oi.variant!.filling!.name,
            quantity: oi.quantity as unknown as number,
            unitprice: oi.unitPrice as unknown as number,
            subtotal: oi.subTotal as unknown as number,
          })),
          totalamount: newOrder.totalAmount as unknown as number,
          deliveryaddress: orderIntentUpdate.deliveryAddress!.address,
          deliveryoption: newOrder.deliveryOption,
          paymentmethod: updatedPayment.method,
          orderurl: orderUrl,
        };
        await sendNewOrderNotificationToSeller({ data: newOrderForSellerData });
      }

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

      // 1. Send receipt email to user after a successful payment(Through Yookassa set up)\
    }
  } catch (error) {
    console.error(
      "An error occur inside the payment notification web-hook -> ",
      error
    );
    throw error;
  }
};
