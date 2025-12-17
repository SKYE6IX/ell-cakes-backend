import { Context } from ".keystone/types";
import { getSessionCartId } from "../lib/getSessionCartId";
import { Session } from "../access";

export const connectCartToUser = async (
  root: any,
  { userId }: { userId: string },
  context: Context
) => {
  const loggedInUser = context.session as Session;
  const sessionCartId = getSessionCartId(context);

  if (!loggedInUser) {
    throw new Error("Failed to connect", {
      cause: "Only authorized user is allowed to perform this action",
    });
  }

  const sessionCart = await context.prisma.cart.findUnique({
    where: { sessionId: sessionCartId },
    select: {
      id: true,
      cartItems: {
        select: { id: true },
      },
    },
  });

  if (sessionCart) {
    //Check if user has an exising cart, then we merge them
    const userCart = await context.db.Cart.findOne({
      where: { user: { id: userId } },
    });
    if (userCart) {
      const cartToUpdate = await context.db.Cart.updateOne({
        where: { id: userCart.id },
        data: {
          cartItems: {
            connect: sessionCart?.cartItems.map((cartItem) => ({
              id: cartItem.id,
            })),
          },
        },
      });
      const result = await context.prisma.cartItem.aggregate({
        _sum: {
          subTotal: true,
        },
        where: {
          cartId: cartToUpdate.id,
        },
      });

      const newCartSubTotal = result._sum.subTotal || 0;

      // Disconnect the cartItems from the session cart and then delete it
      const cartToDelete = await context.db.Cart.updateOne({
        where: { sessionId: sessionCartId },
        data: {
          cartItems: null,
        },
      });
      await context.db.Cart.deleteOne({
        where: { id: cartToDelete.id },
      });

      return await context.db.Cart.updateOne({
        where: { id: cartToUpdate.id },
        data: {
          subTotal: newCartSubTotal,
          updatedAt: new Date(),
        },
      });
    } else {
      return await context.db.Cart.updateOne({
        where: { id: sessionCart?.id },
        data: {
          user: { connect: { id: userId } },
          sessionId: undefined,
          updatedAt: new Date(),
        },
      });
    }
  } else {
    return null;
  }
};
