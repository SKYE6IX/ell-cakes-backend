import bcrypt from "bcryptjs";
import { Context } from ".keystone/types";
import { Session } from "../access";

export const redeemUserVerificationToken = async (
  root: any,
  { token, email }: { token: string; email: string },
  context: Context
) => {
  const loggedInUser = context.session as Session;

  if (!loggedInUser) {
    throw new Error("Only Authorized user can perform this action!", {
      cause: "Authorization",
    });
  }

  const user = await context.db.User.findOne({
    where: { email: email },
  });

  // Check if USER with this number exist!
  if (!user) {
    throw new Error("User with this phone number doesn't exist!", {
      cause: "Invalid data passed!",
    });
  }

  // Compare the token with the harsh saved on database
  const match = token === user.userVerificationToken;

  if (!match) {
    throw new Error("Invalid token", { cause: "Failed on checking token!" });
  }

  // Check and compare the expiration since the token issued
  const issuedAt = user.userVerificationTokenIssuedAt;

  const expiration = 10 * 60 * 1000;

  if (issuedAt && new Date(issuedAt).getTime() + expiration < Date.now()) {
    throw new Error("Token expired");
  }

  await context.db.User.updateOne({
    where: { id: user.id },
    data: {
      isUserVerified: true,
      userVerificationToken: null,
      userVerificationTokenIssuedAt: null,
      userVerificationTokenRedeemedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return {
    status: true,
    message: "Successfully verified user",
  };
};
