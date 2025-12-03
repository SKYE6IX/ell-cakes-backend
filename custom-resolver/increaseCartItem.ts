import { Context } from ".keystone/types";
import type { Session } from "../access";
import type { CartWithItem } from "./addToCart";
import { getSessionCartId } from "../lib/getSessionCartId";

interface IncreaseCartItemArgs {
  cartItemId: string;
}

export const increaseCartItem = async (
  root: any,
  { cartItemId }: IncreaseCartItemArgs,
  context: Context
) => {
  let cart: CartWithItem | null = null;

  const loggedInUser = context.session as Session;
  const sessionCartId = getSessionCartId(context);

  if (loggedInUser) {
    cart = await context.prisma.cart.findUnique({
      where: { userId: loggedInUser.itemId },
      include: { cartItems: true },
    });
  } else {
    cart = await context.prisma.cart.findUnique({
      where: { sessionId: sessionCartId },
      include: { cartItems: true },
    });
  }

  // Throw an error and return the fuction immediatly
  if (cart === null) {
    throw new Error("This Cart doesn't exist anymore!");
  }

  const cartItemToIncrease = cart.cartItems.find(
    (item) => item.id === cartItemId
  );

  if (cartItemToIncrease) {
    const updateQuantity = Number(cartItemToIncrease.quantity) + 1;
    await context.db.CartItem.updateOne({
      where: { id: cartItemToIncrease.id },
      data: {
        quantity: updateQuantity,
        subTotal: Number(cartItemToIncrease.unitPrice) * updateQuantity,
        updatedAt: new Date(),
      },
    });
  }

  // Recalculate the the total amount of cart-items
  await context.transaction(
    async (tx) => {
      const cartItems = await tx.prisma.cartItem.findMany({
        where: { cartId: cart.id },
      });

      const cartSubTotal = cartItems.reduce(
        (sum, item) => sum + Number(item.subTotal),
        0
      );

      await tx.prisma.cart.update({
        where: { id: cart.id },
        data: {
          subTotal: cartSubTotal,
          updatedAt: new Date(),
        },
      });
    },
    { timeout: 10000 }
  );

  return context.db.Cart.findOne({
    where: { id: cart.id },
  });
};
