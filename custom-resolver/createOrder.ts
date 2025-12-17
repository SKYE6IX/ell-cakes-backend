import { Prisma } from "@prisma/client";
import { Context } from ".keystone/types";
import type { JSONValue } from "@keystone-6/core/types";
import type { CustomizationSnapshot } from "./addToCart";
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

  const cart = await context.prisma.cart.findUnique({
    where: { id: orderIntent.cartId || "" },
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
        deliveryAddress: { connect: { id: orderIntent.deliveryAddressId } },
        orderItems: { create: orderItems },
        orderNumber,
        shippingCost: orderIntent.shippingCost,
        subTotalAmount: cart?.subTotal,
        totalAmount: orderIntent.totalAmount,
        note: orderIntent.note ?? null,
        orderIntent: { connect: { id: orderIntent.id } },
      },
    });

    // We need to check if user has added customize image,
    // and connect the new order id to it.
    for (const orderItem of orderItems) {
      const snapShots =
        orderItem.customizations as unknown as CustomizationSnapshot[];
      if (snapShots) {
        for (const snapShot of snapShots) {
          if (snapShot.name === "PHOTOS") {
            snapShot.customValue.imagesId?.forEach(async (imageId) => {
              await sudoContext.query.CustomizeImage.updateOne({
                where: { id: imageId },
                data: {
                  order: { connect: { id: newOrder.id } },
                },
              });
            });
          }
        }
      }
    }

    // Clean up the cart
    await sudoContext.db.Cart.deleteOne({
      where: { id: cart?.id },
    });

    return newOrder;
  } else {
    return null;
  }
};
