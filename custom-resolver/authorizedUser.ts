import { Context } from ".keystone/types";

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

  const { data, errors } = await sudoContext.graphql.raw<
    { authenticateUserWithPassword: { item: { id: string }; message: string } },
    {}
  >({
    query: `
    mutation AuthenticateUserWithPassword($email: String!, $password: String!) {
     authenticateUserWithPassword(email: $email, password: $password) {
     ... on UserAuthenticationWithPasswordFailure {
      message
     }
    ... on UserAuthenticationWithPasswordSuccess {
      item {
        id
      }
    }
    }
  }
    `,
    variables: { email, password },
  });

  if (errors) {
    throw new Error(errors[0].message);
  } else if (data?.authenticateUserWithPassword.message) {
    throw new Error(data?.authenticateUserWithPassword.message);
  }
  return await sudoContext.db.User.updateOne({
    where: { id: data?.authenticateUserWithPassword.item.id },
    data: {
      lastLogin: new Date(),
    },
  });
};
