import { Context } from ".keystone/types";
import { issuePhoneNumberToken } from "../lib/issuePhoneNumberToken";
import { Session } from "../access";

export const resendPhoneNumberToken = async (
  root: any,
  { phoneNumber }: { phoneNumber: string },
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
    where: { phoneNumber: phoneNumber },
  });

  if (!user) {
    throw new Error("User with this phone number doesn't exist!", {
      cause: "Unabale to find user in database",
    });
  }

  // Generate a new token and update user!
  const { token, issuedAt } = await issuePhoneNumberToken({ phoneNumber });
  await context.db.User.updateOne({
    where: { id: user.id },
    data: {
      isPhoneNumberVerified: false,
      phoneNumberToken: token,
      phoneNumberVerificationIssuedAt: issuedAt,
      phoneNumberVerificationRedeemedAt: null,
      updatedAt: issuedAt,
    },
  });

  return "Token Sent!";
};
