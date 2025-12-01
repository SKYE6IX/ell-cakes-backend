import { Context } from ".keystone/types";
import { getSessionId } from "../lib/getSessionId";

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

  // Checking while user signing in if there is a cart already available
  // and update the cart with the user ID
  const existingCart = await sudoContext.db.Cart.findOne({
    where: { sessionId },
  });
  if (existingCart) {
    await sudoContext.db.Cart.updateOne({
      where: {
        id: existingCart.id,
      },
      data: {
        user: { connect: { id: data?.authenticateUserWithPassword.item.id } },
        updatedAt: new Date(),
      },
    });
  }

  return await sudoContext.db.User.findOne({
    where: { id: data?.authenticateUserWithPassword.item.id },
  });
};
