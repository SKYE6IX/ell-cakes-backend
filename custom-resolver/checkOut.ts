import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ICreatePayment } from "@a2seven/yoo-checkout";
import { customAlphabet } from "nanoid";
import { Context } from ".keystone/types";
import yooMoneyPaymentGateway from "../lib/paymentGateway";
import type { Session } from "../access";

interface CheckOutArgs {
  shippingCost: number;
  paymentMethod: "bank_card" | "sberbank" | "tinkoff_bank" | "sbp";
}

export type CartWithItem = Prisma.CartGetPayload<{
  include: {
    cartItems: { include: { variant: true; topping: true; product: true } };
  };
}>;

export const checkOut = async (
  root: any,
  { shippingCost, paymentMethod }: CheckOutArgs,
  context: Context
) => {
  const loggedInUser = context.session as Session;

  // Reject with error if USER isn't in session
  if (!loggedInUser) {
    throw new Error("Only signed in user can perform this action!");
  }
  const yooMoney = await yooMoneyPaymentGateway();
  // Generate unique ID for payment

  // We check if user has a pending pyament order!
  const pendingOrder = await context.prisma.order.findFirst({
    where: {
      userId: loggedInUser.itemId,
      payment: { status: { equals: "pending" } },
    },
    include: { payment: true },
  });
  if (pendingOrder) {
    // If USER change their payment method, then we create a new payment
    const createPayLoad: ICreatePayment = {
      amount: {
        value: `${pendingOrder.totalAmount}`,
        currency: "RUB",
      },
      payment_method_data: {
        type: paymentMethod,
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.FRONTEND_URL}/order/order-confirmation?orderNumber=${pendingOrder.orderNumber}`,
      },
      capture: true,
    };
    const processPayment = await yooMoney.createPayment(
      createPayLoad,
      uuidv4()
    );
    return await context.db.Payment.updateOne({
      where: { id: pendingOrder.payment?.id },
      data: {
        paymentId: processPayment.id,
        confirmationUrl: processPayment.confirmation.confirmation_url,
        method: processPayment?.payment_method.type,
        status: "pending",
      },
    });
  }

  // If User doesn't have any pending Order with payment pending
  // We can contiune to create a new order
  // Generate unique ID for each order
  const alphabet = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 8);
  const orderNumber = `ORD-${nanoid()}`;
  // Get the cart that belong to the current signin USER
  const cart = await context.query.Cart.findOne({
    where: { user: { id: loggedInUser.itemId } },
    query:
      "id subTotal cartItems { id quantity unitPrice subTotal product { id } productSnapShot variantSnapShot customizationSnapShot variant { id } topping { id weight extraPrice } }",
  });
  if (!cart) {
    throw new Error("User doesn't have open cart at the moment");
  }

  // Calculate and setup payment process
  const totalAmount = Number(cart.subTotal) + shippingCost;
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
      return_url: `${process.env.FRONTEND_URL}/order/order-confirmation?orderNumber=${orderNumber}`,
    },
    capture: true,
  };

  // Process payment for the transaction
  const processPayment = await yooMoney.createPayment(createPayLoad, uuidv4());
  // Create a new order-items and order
  const orderItems = cart.cartItems.map((cartItem: any) => {
    const item = {
      product: { connect: { id: cartItem.product.id } },
      productSnapShot: cartItem.productSnapShot,
      quantity: cartItem.quantity,
      unitPrice: cartItem.unitPrice,
      subTotal: cartItem.subTotal,
      ...(cartItem.variant && {
        variant: { connect: { id: cartItem.variant.id } },
        variantSnapShot: cartItem.variantSnapShot,
      }),
      customizationSnapShot: cartItem.customizationSnapShot,
      ...(cartItem.topping && {
        toppingSnapShot: {
          id: cartItem.topping.id,
          weight: cartItem.topping.weight,
          extraPrice: cartItem.topping.extraPrice,
        },
      }),
    };
    return item;
  });

  const order = await context.db.Order.createOne({
    data: {
      user: { connect: { id: loggedInUser.itemId } },
      orderItems: { create: orderItems },
      orderNumber: orderNumber,
      subTotalAmount: cart.subTotal,
      totalAmount: totalAmount,
      shippingCost: shippingCost,
    },
  });

  // Cleanup the cart
  await context.db.Cart.deleteOne({
    where: { id: cart.id },
  });
  // Create a new Payment entity for the order
  const payment = await context.db.Payment.createOne({
    data: {
      user: { connect: { id: loggedInUser.itemId } },
      order: { connect: { id: order.id } },
      paymentId: processPayment?.id,
      confirmationUrl: processPayment?.confirmation.confirmation_url,
      amount: processPayment?.amount.value,
      method: processPayment?.payment_method.type,
      status: "pending",
    },
  });
  return payment;
};
