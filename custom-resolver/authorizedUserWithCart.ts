import { Context } from ".keystone/types";

interface AuthorizedUserWithCartArgs {
  email: string;
  password: string;
  cartId: string;
}

export const authorizedUserWithCart = async (
  root: any,
  { email, password, cartId }: AuthorizedUserWithCartArgs,
  context: Context
) => {
  const sudoContext = context.sudo();

  const existingCart = await sudoContext.db.Cart.findOne({
    where: { id: cartId },
  });

  if (!existingCart) {
    throw new Error("Unable to login user, cart must exist!");
  }

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
  // Update the cart so it belong to the user
  await sudoContext.db.Cart.updateOne({
    where: {
      id: existingCart.id,
    },
    data: {
      user: { connect: { id: data?.authenticateUserWithPassword.item.id } },
      updatedAt: new Date(),
    },
  });
  return await sudoContext.db.User.findOne({
    where: { id: data?.authenticateUserWithPassword.item.id },
  });
};
