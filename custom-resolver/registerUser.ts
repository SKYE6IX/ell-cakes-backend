import { Context } from ".keystone/types";
import { getSessionCartId } from "../lib/getSessionCartId";

interface RegisterUserArgs {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

// TODO:
// 1. Set up SMS verification so has to confirm USER are real and not a bot
export const registerUser = async (
  root: any,
  { registerData }: { registerData: RegisterUserArgs },
  context: Context
) => {
  const sudoContext = context.sudo();
  const sessionCartId = getSessionCartId(context);

  // Check if USER with the email or phoneNumber already exist
  const isUserExist = await sudoContext.db.User.findOne({
    where: { email: registerData.email, phoneNumber: registerData.phoneNumber },
  });

  if (isUserExist) {
    throw new Error("User with this email and phone number already exist!");
  }

  // Create a new USER
  const newUser = await sudoContext.db.User.createOne({
    data: {
      ...registerData,
    },
  });

  // authorized USER if successfully created
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
    variables: { email: newUser.email, password: registerData.password },
  });

  if (errors) {
    throw new Error(errors[0].message);
  }

  const sessionCart = await sudoContext.db.Cart.findOne({
    where: { sessionId: sessionCartId },
  });

  if (sessionCart) {
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

  return await sudoContext.db.User.findOne({
    where: { id: data?.authenticateUserWithPassword.item.id },
  });
};
