import { Context } from ".keystone/types";

interface RegisterUserArgs {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface RegisterUserWithCartArgs {
  cartId: string;
  registerData: RegisterUserArgs;
}

export const registerUserWithCart = async (
  root: any,
  { cartId, registerData }: RegisterUserWithCartArgs,
  context: Context
) => {
  const sudoContext = context.sudo();
  // Query the cart
  const existingCart = await sudoContext.db.Cart.findOne({
    where: { id: cartId },
  });

  if (!existingCart) {
    throw new Error("Unable to register user, cart must exist!");
  }

  // Register the user as usual
  const { data, errors } = await sudoContext.graphql.raw<
    { registerUser: { id: string } },
    {}
  >({
    query: `
     mutation RegisterUser($registerData: RegisterUserInput!) {
       registerUser(registerData: $registerData) {
        id
       }
     }
    `,
    variables: {
      registerData: {
        ...registerData,
      },
    },
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
      user: { connect: { id: data?.registerUser.id } },
      updatedAt: new Date(),
    },
  });

  return await sudoContext.db.User.findOne({
    where: { id: data?.registerUser.id },
  });
};
