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
  customerNote?: string;
  deliveryAddressId: string;
}

export type CartWithItem = Prisma.CartGetPayload<{
  include: {
    cartItems: { include: { variant: true; topping: true; product: true } };
  };
}>;

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

  const user = await context.db.User.findOne({
    where: { id: loggedInUser.itemId },
  });

  const yooMoney = await yooMoneyPaymentGateway();

  // We check if user has a pending pyament order!
  const pendingOrder = await context.prisma.order.findFirst({
    where: {
      userId: user?.id,
      payment: { status: { equals: "pending" } },
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
        status: "pending",
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
  const cart = await context.query.Cart.findOne({
    where: { user: { id: user?.id } },
    query:
      "id subTotal cartItems { id quantity unitPrice subTotal product { id } productSnapShot variantSnapShot customizationSnapShot variant { id } topping { id weight extraPrice } }",
  });

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
      ...(cartItem.customizationSnapShot && {
        customizationSnapShot: cartItem.customizationSnapShot,
      }),
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

  //Connect the DeliveryAddress
  const deliveryAddress = await context.db.DelivaryAddress.findOne({
    where: { id: deliveryAddressId },
  });

  // Create a new ORDER
  const order = await context.db.Order.createOne({
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

  // Clean up the cart
  await context.db.Cart.deleteOne({
    where: { id: cart.id },
  });

  // Create a new Payment entity for the order and return it
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
