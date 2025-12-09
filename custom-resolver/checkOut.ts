import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ICreatePayment } from "@a2seven/yoo-checkout";
import { customAlphabet } from "nanoid";
import { Context } from ".keystone/types";
import yooMoneyPaymentGateway from "../lib/paymentGateway";
import type { Session } from "../access";
import type { JSONValue } from "@keystone-6/core/types";
import type { CustomizationSnapshot } from "./addToCart";

interface CheckOutArgs {
  deliveryAddressId: string;
  shippingCost: number;
  paymentMethod: "bank_card" | "sberbank" | "tinkoff_bank" | "sbp";
  customerNote?: string;
}

type CartWithItem = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: { product: true; variant: true; toppingOption: true };
    };
  };
}>;

export enum PaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
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
    throw new Error("Only signed in user can perform this action!");
  }

  const yooMoney = await yooMoneyPaymentGateway();

  // We check if user has a pending pyament order!
  const pendingOrder = await context.prisma.order.findFirst({
    where: {
      userId: loggedInUser.itemId,
      payment: { status: { equals: PaymentStatus.PENDING } },
    },
    include: { payment: true },
  });

  if (pendingOrder) {
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
        status: PaymentStatus.PENDING,
        updatedAt: new Date(),
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
  const cart = (await context.query.Cart.findOne({
    where: { user: { id: loggedInUser.itemId } },
    query: `
      id
      subTotal
      cartItems { id quantity unitPrice subTotal compositionSnapShot customizationsSnapShot product { id } variant { id } toppingOption { id } }
    `,
  })) as CartWithItem;

  // Reject with an error if User doesn't have a cart
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
  const orderItems = cart.cartItems.map((cartItem) => {
    const item = {
      product: { connect: { id: cartItem.product?.id } },
      variant: { connect: { id: cartItem.variant?.id } },
      quantity: cartItem.quantity,
      unitPrice: cartItem.unitPrice,
      subTotal: cartItem.subTotal,
      ...(cartItem.toppingOption && {
        toppingOption: { connect: { id: cartItem.toppingOption.id } },
      }),
      ...(cartItem.compositionSnapShot && {
        compositionSnapShot: cartItem.compositionSnapShot as JSONValue,
      }),
      ...(cartItem.customizationsSnapShot && {
        customizationsSnapShot: cartItem.customizationsSnapShot as JSONValue,
      }),
    };
    return item;
  });

  // Get the seleceted delivery address for user
  const deliveryAddress = await context.db.DelivaryAddress.findOne({
    where: { id: deliveryAddressId },
  });

  // Create a new ORDER
  const newOrder = await context.db.Order.createOne({
    data: {
      user: { connect: { id: loggedInUser.itemId } },
      deliveryAddress: { connect: { id: deliveryAddress?.id } },
      orderItems: { create: orderItems },
      orderNumber: orderNumber,
      subTotalAmount: cart.subTotal,
      totalAmount: totalAmount,
      shippingCost: shippingCost,
      ...(customerNote && { note: customerNote }),
    },
  });

  // We need to check if user has added customize image,
  // and connect the new order id to it.
  const cartItems = cart.cartItems;
  for (const cartItem of cartItems) {
    const snapShots =
      cartItem.customizationsSnapShot as unknown as CustomizationSnapshot[];
    for (const snapShot of snapShots) {
      if (snapShot.name !== "PHOTOS") {
        continue;
      }
      snapShot.customValue.imagesId?.forEach(async (imageId) => {
        await context.query.CustomizeImage.updateOne({
          where: { id: imageId },
          data: {
            order: { connect: { id: newOrder.id } },
          },
        });
      });
    }
  }

  // Clean up the cart
  await context.db.Cart.deleteOne({
    where: { id: cart.id },
  });

  // Create a new Payment entity for the order and return it
  const payment = await context.db.Payment.createOne({
    data: {
      user: { connect: { id: loggedInUser.itemId } },
      order: { connect: { id: newOrder.id } },
      paymentId: processPayment?.id,
      confirmationUrl: processPayment?.confirmation.confirmation_url,
      amount: processPayment?.amount.value,
      method: processPayment?.payment_method.type,
      status: PaymentStatus.PENDING,
    },
  });

  return payment;
};
