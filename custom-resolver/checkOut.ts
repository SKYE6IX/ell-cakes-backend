import { v4 as uuidv4 } from "uuid";
import { ICreatePayment } from "@a2seven/yoo-checkout";
import { customAlphabet } from "nanoid";
import { Context } from ".keystone/types";
import yooMoneyPaymentGateway from "../lib/paymentGateway";
import type { Session } from "../access";

interface CheckOutArgs {
  deliveryAddressId: string;
  shippingCost: number;
  paymentMethod: "bank_card" | "sberbank" | "tinkoff_bank" | "sbp";
  customerNote?: string;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  CANCELED = "CANCELED",
}

export const checkOut = async (
  root: any,
  {
    shippingCost,
    paymentMethod,
    customerNote,
    deliveryAddressId,
  }: CheckOutArgs,
  context: Context
) => {
  const loggedInUser = context.session as Session;

  // Reject with error if USER isn't in session
  if (!loggedInUser) {
    throw new Error("Only signed in user can perform this action!", {
      cause: "Authorization!",
    });
  }

  // Setup payment
  const yooMoney = await yooMoneyPaymentGateway();

  // Generate unique ID for each intent
  const alphabet = "0123456789abcdefghjklmnpqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 8);
  const intentId = nanoid();

  // Get the cart that belong to the current signin USER
  const userCart = await context.prisma.cart.findUnique({
    where: { userId: loggedInUser.itemId },
    select: { id: true, subTotal: true },
  });

  // Reject with an error if User doesn't have a cart
  if (!userCart) {
    throw new Error("User doesn't have open cart at the moment", {
      cause: "Cart not found!",
    });
  }

  // Calculate and setup payment processing
  const totalAmount = Number(userCart.subTotal) + shippingCost;

  // console.log("Total Amount -> ", totalAmount);

  const createPayLoad: ICreatePayment = {
    amount: {
      value: `${totalAmount}`,
      currency: "RUB",
    },
    payment_method_data: {
      type: paymentMethod,
    },
    confirmation: {
      type: "redirect",
      return_url: `${process.env.FRONTEND_URL}/order/order-status?iid=${intentId}`,
    },
    capture: true,
  };

  // Process payment for the transaction
  const processPayment = await yooMoney.createPayment(createPayLoad, uuidv4());

  // Create a new Order Intent
  await context.db.OrderIntent.createOne({
    data: {
      intentId,
      yooMoneyId: processPayment.id,
      cart: { connect: { id: userCart.id } },
      user: { connect: { id: loggedInUser.itemId } },
      deliveryAddress: { connect: { id: deliveryAddressId } },
      note: customerNote ?? undefined,
      totalAmount,
      shippingCost,
      paymentStatus: PaymentStatus.PENDING,
    },
  });

  // Create a new Payment entity for the order and return it
  const payment = await context.db.Payment.createOne({
    data: {
      yooMoneyId: processPayment?.id,
      amount: processPayment?.amount.value,
      method: processPayment?.payment_method.type,
      redirectUrl: processPayment.confirmation.confirmation_url,
      status: PaymentStatus.PENDING,
    },
  });

  return payment;
};
