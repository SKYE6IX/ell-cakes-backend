import { Context } from ".keystone/types";
import { issueVerificationToken } from "../lib/issueVerificationToken";
import { Session } from "../access";

export const resendUserVerificationToken = async (
  root: any,
  { email }: { email: string },
  context: Context
) => {
  const loggedInUser = context.session as Session;

  if (!loggedInUser) {
    throw new Error("Only Authorized user can perform this action!", {
      cause: "Authorization",
    });
  }

  // We need to check if the phoneNumber has a user
  const user = await context.db.User.findOne({
    where: { email: email },
  });

  if (!user) {
    throw new Error("User with this phone number doesn't exist!", {
      cause: "Unabale to find user in database",
    });
  }

  // Generate a new token and send to user and update user!
  const { token, issuedAt } = await issueVerificationToken({
    email,
    type: "user-verification",
  });

  await context.db.User.updateOne({
    where: { id: user.id },
    data: {
      isUserVerified: false,
      userVerificationToken: token,
      userVerificationTokenIssuedAt: issuedAt,
      userVerificationTokenRedeemedAt: null,
      updatedAt: issuedAt,
    },
  });

  return "Token Sent!";
};
