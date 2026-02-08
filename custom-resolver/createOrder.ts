import { Prisma } from "@prisma/client";
import { Context } from ".keystone/types";
import type { JSONValue } from "@keystone-6/core/types";
import { customAlphabet } from "nanoid";

interface CreateOrderArgs {
  context: Context;
  orderIntent: Prisma.OrderIntentGetPayload<{}>;
}

export const createOrder = async ({
  context,
  orderIntent,
}: CreateOrderArgs) => {
  const sudoContext = context.sudo();

  const alphabet = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 8);
  const orderNumber = `ORD-${nanoid()}`;

  if (!orderIntent || !orderIntent.cartId) return null;

  const cart = await context.prisma.cart.findUnique({
    where: { id: orderIntent.cartId },
    include: {
      cartItems: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          subTotal: true,
          productId: true,
          variantId: true,
          toppingOptionId: true,
          compositions: true,
          customizations: true,
        },
      },
    },
  });

  // Create a new order-items and order
  const orderItems = cart?.cartItems.map((cartItem) => {
    const item = {
      product: { connect: { id: cartItem.productId } },
      variant: { connect: { id: cartItem.variantId } },
      quantity: cartItem.quantity,
      unitPrice: cartItem.unitPrice,
      subTotal: cartItem.subTotal,
      compositions: cartItem.compositions as JSONValue,
      customizations: cartItem.customizations as JSONValue,
      ...(cartItem.toppingOptionId && {
        toppingOption: { connect: { id: cartItem.toppingOptionId } },
      }),
    };
    return item;
  });

  if (orderItems) {
    // Create a new ORDER
    const newOrder = await sudoContext.db.Order.createOne({
      data: {
        payment: { connect: { id: orderIntent.paymentId } },
        user: { connect: { id: orderIntent.userId } },
        ...(orderIntent.orderReceiverId && {
          orderReceiver: { connect: { id: orderIntent.orderReceiverId } },
        }),
        ...(orderIntent.deliveryAddressId && {
          deliveryAddress: { connect: { id: orderIntent.deliveryAddressId } },
        }),
        deliveryDate: orderIntent.deliveryDate,
        orderItems: { create: orderItems },
        orderNumber,
        shippingCost: orderIntent.shippingCost,
        subTotalAmount: cart?.subTotal,
        totalAmount: orderIntent.totalAmount,
        note: orderIntent.note ?? null,
        deliveryOption: orderIntent.deliveryOption,
        orderIntent: { connect: { id: orderIntent.id } },
      },
    });

    // Clean up the cart
    await sudoContext.db.Cart.deleteOne({
      where: { id: cart?.id },
    });
    return newOrder;
  } else {
    return null;
  }
};
