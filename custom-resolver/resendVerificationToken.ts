import { Context } from ".keystone/types";
import { issueVerificationToken } from "../lib/issueVerificationToken";

export const resendVerificationToken = async (
  root: any,
  { phoneNumber }: { phoneNumber: string },
  context: Context
) => {
  // Check if USER has a session
  const isLoggeIn = context.session;
  if (!isLoggeIn) {
    throw new Error("Only signed in user allow to perform this operation");
  }
  // Find the user with the phone number
  const user = await context.db.User.findOne({
    where: { phoneNumber: phoneNumber },
  });
  if (!user) {
    throw new Error("User with this phone number doesn't exist!");
  }

  // Continue operation
  await issueVerificationToken({ userId: user.id, context });

  return "Token Sent!";
};
