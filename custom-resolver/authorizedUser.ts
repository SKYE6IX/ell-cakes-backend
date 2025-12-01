import { Context } from ".keystone/types";
import { getSessionId } from "../lib/getSessionId";
import { CartWithItem } from "./addToCart";

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
  const sessionId = await getSessionId(context);

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

  const sessionCart = (await sudoContext.query.Cart.findOne({
    where: { sessionId },
    query: "id cartItems { id }",
  })) as CartWithItem;

  if (sessionCart) {
    // We need to check if user already has a cart from diffrent
    // device
    const userCart = await sudoContext.db.Cart.findOne({
      where: { user: { id: data?.authenticateUserWithPassword.item.id } },
    });

    // If the cart exist, we merge the sesssionCart items into the userCart
    // and then clean up the sessionCart. so user continue with cart related to there own id
    if (userCart) {
      // Update user cart by connecting the cart-item id from the session cart
      await sudoContext.db.Cart.updateOne({
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
      await sudoContext.db.Cart.updateOne({
        where: { sessionId },
        data: {
          cartItems: null,
        },
      }).then(async () => {
        await sudoContext.db.Cart.deleteOne({ where: { sessionId } });
      });
    } else {
      // If there is no cart from the user, we connext the current cart from sesssion with
      // the userID
      await sudoContext.db.Cart.updateOne({
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
