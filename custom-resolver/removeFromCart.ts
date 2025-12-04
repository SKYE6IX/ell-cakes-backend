import { Context } from ".keystone/types";

interface RemoveFromCartArgs {
  cartItemId: string;
}

export const removeFromCart = async (
  root: any,
  { cartItemId }: RemoveFromCartArgs,
  context: Context
) => {
  const deletedCartItem = await context.prisma.cartItem.delete({
    where: { id: cartItemId },
    select: {
      cart: { select: { id: true } },
    },
  });

  // Count the current Item in the Cart and check if there still item remain
  const cartItemCount = await context.prisma.cartItem.count({
    where: { cartId: deletedCartItem?.cart?.id },
  });

  if (cartItemCount == 0) {
    await context.db.Cart.deleteOne({
      where: { id: deletedCartItem?.cart?.id },
    });

    return null;
  } else {
    const result = await context.prisma.cartItem.aggregate({
      _sum: {
        subTotal: true,
      },
      where: {
        cartId: deletedCartItem?.cart?.id,
      },
    });

    const newCartSubTotal = result._sum.subTotal || 0;

    return context.db.Cart.updateOne({
      where: { id: deletedCartItem?.cart?.id },
      data: {
        subTotal: newCartSubTotal,
        updatedAt: new Date(),
      },
    });
  }
};
