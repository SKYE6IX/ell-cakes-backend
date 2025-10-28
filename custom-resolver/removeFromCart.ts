import { Context } from ".keystone/types";
import type { Session } from "../access";
import type { CartWithItem } from "./addToCart";

interface RemoveFromCartArgs {
  cartItemId: string;
  cartId: string;
}

export const removeFromCart = async (
  root: any,
  { cartId, cartItemId }: RemoveFromCartArgs,
  context: Context
) => {
  let cart: CartWithItem | null = null;
  const loggedInUser = context.session as Session;

  if (loggedInUser) {
    cart = await context.prisma.cart.findUnique({
      where: { userId: loggedInUser.itemId },
      include: { cartItems: true },
    });
  } else {
    cart = await context.prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: true },
    });
  }

  // Throw an error and return the fuction immediatly
  if (cart === null) {
    throw new Error("This Cart doesn't exist anymore!");
  }

  // If cart found, continue
  const cartItemToRemoveOrReduce = cart.cartItems.find(
    (item) => item.id === cartItemId
  );
  if (cartItemToRemoveOrReduce) {
    const updateQuantity = Number(cartItemToRemoveOrReduce.quantity) - 1;
    if (updateQuantity <= 0) {
      await context.db.CartItem.deleteOne({
        where: { id: cartItemToRemoveOrReduce.id },
      });
    } else {
      await context.db.CartItem.updateOne({
        where: { id: cartItemToRemoveOrReduce.id },
        data: {
          quantity: updateQuantity,
          subTotal: Number(cartItemToRemoveOrReduce.unitPrice) * updateQuantity,
          updatedAt: new Date(),
        },
      });
    }
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
