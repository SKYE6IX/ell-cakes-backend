import { Context } from ".keystone/types";

interface RegisterUserArgs {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export const registerUser = async (
  root: any,
  { name, email, password, phoneNumber }: RegisterUserArgs,
  context: Context
) => {
  const sudoContext = context.sudo();
  // Check if USER with the email or phoneNumber already exist
  const isUserExist = await sudoContext.db.User.findOne({
    where: { email: email, phoneNumber: phoneNumber },
  });

  if (isUserExist) {
    throw new Error("User with this email and phone number already exist!");
  }

  // Create a new USER
  const newUser = await sudoContext.db.User.createOne({
    data: {
      name,
      email,
      password,
      phoneNumber,
    },
  });

  // authorized USER if successfully created
  const { data } = await sudoContext.graphql.raw<
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
    variables: { email: newUser.email, password: password },
  });

  return await sudoContext.db.User.findOne({
    where: { id: data?.authenticateUserWithPassword.item.id },
  });
};
