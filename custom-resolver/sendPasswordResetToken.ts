import { Context } from ".keystone/types";
import { issueVerificationToken } from "../lib/issueVerificationToken";

export const sendPasswordResetToken = async (
  root: any,
  { email }: { email: string },
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

  const { token, issuedAt } = await issueVerificationToken({
    email,
    type: "password-reset",
  });

  await sudoContext.db.User.updateOne({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetIssuedAt: issuedAt,
    },
  });

  return "Token Sent!";
};
