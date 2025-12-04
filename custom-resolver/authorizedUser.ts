import { Context } from ".keystone/types";
import { getSessionCartId } from "../lib/getSessionCartId";

interface AuthorizedUser {
  email: string;
  password: string;
}

export const authorizedUser = async (
  root: any,
  { email, password }: AuthorizedUser,
  context: Context
) => {
  const sudoContext = context.sudo();
  const sessionCartId = getSessionCartId(context);

  // authorized USER
  const { data, errors } = await sudoContext.graphql.raw<
    { authenticateUserWithPassword: { item: { id: string } } },
    {}
  >({
    query: `
     mutation AuthenticateUserWithPassword($email: String!, $password: String!) {
       authenticateUserWithPassword(email: $email, password: $password) {
         ... on UserAuthenticationWithPasswordSuccess {
            item {
               id
            }
          }
       }
     }
    `,
    variables: { email: email, password: password },
  });

  if (errors) {
    throw new Error(errors[0].message);
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

  // We check if there is any cart in the connected to the session at all
  // if there is none, we skip running the codes
  if (sessionCart) {
    // We check if user already has a cart and we update it.
    // it will return null if user doesn't have a cart.
    const userCart = await context.prisma.cart.findUnique({
      where: { userId: data?.authenticateUserWithPassword.item.id },
      select: {
        id: true,
      },
    });

    // if there is a cart for the user, we merge it with the current session Cart
    if (userCart) {
      await context.db.Cart.updateOne({
        where: { id: userCart.id },
        data: {
          cartItems: {
            connect: sessionCart.cartItems.map((cartItem) => ({
              id: cartItem.id,
            })),
          },
        },
      });

      // Update session cart and disconnect the cart-item before deleting it
      // to avoid cascading the cart-items
      await context.db.Cart.updateOne({
        where: { sessionId: sessionCartId },
        data: {
          cartItems: null,
        },
      }).then(async () => {
        await context.db.Cart.deleteOne({
          where: { sessionId: sessionCartId },
        });
      });
    } else {
      // If there is no cart from the user, we connext the current cart from sesssion with
      // the userID

      await context.db.Cart.updateOne({
        where: {
          id: sessionCart.id,
        },
        data: {
          user: { connect: { id: data?.authenticateUserWithPassword.item.id } },
          updatedAt: new Date(),
        },
      });
    }
  }

  return await sudoContext.db.User.findOne({
    where: { id: data?.authenticateUserWithPassword.item.id },
  });
};
