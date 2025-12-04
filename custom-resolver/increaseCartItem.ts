import { Context } from ".keystone/types";

interface IncreaseCartItemArgs {
  cartItemId: string;
}
export const increaseCartItem = async (
  root: any,
  { cartItemId }: IncreaseCartItemArgs,
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

  if (cartItem) {
    const updateQuantity = Number(cartItem.quantity) + 1;
    await context.query.CartItem.updateOne({
      where: { id: cartItem.id },
      data: {
        quantity: updateQuantity,
        subTotal: Number(cartItem.unitPrice) * updateQuantity,
        updatedAt: new Date(),
      },
    });
  }

  // Recalculate the the total amount of cart-items
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
};
