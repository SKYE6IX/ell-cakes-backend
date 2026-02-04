import { Context } from ".keystone/types";

export const validatePasswordResetToken = async (
  root: any,
  { token, email }: { token: string; email: string },
  context: Context
) => {
  const sudoContext = context.sudo();

  const user = await sudoContext.db.User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User with this phone number doesn't exist!", {
      cause: "Invalid data passed!",
    });
  }

  const match = token === user.passwordResetToken;

  if (!match) {
    throw new Error("Invalid token!", { cause: "Failed to match!" });
  }

  const issuedAt = user.passwordResetIssuedAt;
  const expiration = 10 * 60 * 1000;

  if (issuedAt && new Date(issuedAt).getTime() + expiration < Date.now()) {
    throw new Error("Token expired!");
  }

  return match;
};
