import { Context } from ".keystone/types";

export const verifyEmail = async (
  root: any,
  { token, email }: { token: string; email: string },
  context: Context
) => {
  const user = await context.db.User.findOne({
    where: { email: email },
  });

  if (!user || user.emailVerificationToken !== token) {
    throw new Error("Invalid token");
  }
  const issuedAt = user.emailVerificationIssuedAt;
  const expiration = 60 * 60 * 1000;
  if (issuedAt && new Date(issuedAt).getTime() + expiration < Date.now()) {
    throw new Error("Token expired");
  }

  await context.db.User.updateOne({
    where: { email: email },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationIssuedAt: null,
      emailVerificationRedeemedAt: new Date(),
    },
  });

  return {
    status: true,
    message: "Email verification is successfully",
  };
};
