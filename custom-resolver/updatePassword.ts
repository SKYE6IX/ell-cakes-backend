import bcrypt from "bcryptjs";
import { Context } from ".keystone/types";

export const updatePassword = async (
  root: any,
  {
    token,
    phoneNumber,
    newPassword,
  }: { token: string; phoneNumber: string; newPassword: string },
  context: Context
) => {
  const sudoContext = context.sudo();

  const user = await sudoContext.db.User.findOne({
    where: { phoneNumber },
  });

  if (!user) {
    throw new Error("User with this email doesn't exist!", {
      cause: "Invalid data passed!",
    });
  }

  const match = await bcrypt.compare(token, user.passwordResetToken as string);
  if (!match) {
    throw new Error("Invalid token", { cause: "Failed on bcrypt" });
  }

  // Check and compare the expiration since the token issued
  const issuedAt = user.passwordResetIssuedAt;
  const expiration = 30 * 60 * 1000;

  if (issuedAt && new Date(issuedAt).getTime() + expiration < Date.now()) {
    throw new Error("Token expired!");
  }

  const updateUser = await sudoContext.db.User.updateOne({
    where: { id: user.id },
    data: {
      passwordResetToken: null,
      passwordResetRedeemedAt: new Date(),
      passwordResetIssuedAt: null,
      password: newPassword,
    },
  });

  //Authorized user
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
    variables: { email: updateUser.email, password: newPassword },
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
