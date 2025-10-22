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

  try {
    await context.db.User.updateOne({
      where: { email: email },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationIssuedAt: null,
        emailVerificationRedeemedAt: new Date(),
      },
    });
  } catch (error) {
    // @ts-expect-error error has an unknow type
    throw new Error(error.message);
  }

  return {
    status: true,
    message: "Email verification is successfully",
  };
};
