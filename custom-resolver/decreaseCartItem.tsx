import { Context } from ".keystone/types";

interface DecreaseCartItem {
  cartItemId: string;
}

export const decreaseCartItem = async (
  root: any,
  { cartItemId }: DecreaseCartItem,
  context: Context
) => {
  const cartItem = await context.prisma.cartItem.findUnique({
    where: { id: cartItemId },
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      subTotal: true,
      cart: { select: { id: true } },
    },
  });

  const updateQuantity = Number(cartItem?.quantity) - 1;
  if (updateQuantity <= 0) {
    await context.db.CartItem.deleteOne({
      where: { id: cartItem?.id },
    });
  } else {
    await context.db.CartItem.updateOne({
      where: { id: cartItem?.id },
      data: {
        quantity: updateQuantity,
        subTotal: Number(cartItem?.unitPrice) * updateQuantity,
        updatedAt: new Date(),
      },
    });
  }

  // Count the current Item in the Cart and check if there still remain
  const cartItemCount = await context.prisma.cartItem.count({
    where: { cartId: cartItem?.cart?.id },
  });

  if (cartItemCount == 0) {
    await context.db.Cart.deleteOne({ where: { id: cartItem?.cart?.id } });
    return null;
  } else {
    const result = await context.prisma.cartItem.aggregate({
      _sum: {
        subTotal: true,
      },
      where: {
        cartId: cartItem?.cart?.id,
      },
    });
    const newCartSubTotal = result._sum.subTotal || 0;
    return context.db.Cart.updateOne({
      where: { id: cartItem?.cart?.id },
      data: {
        subTotal: newCartSubTotal,
        updatedAt: new Date(),
      },
    });
  }
};
