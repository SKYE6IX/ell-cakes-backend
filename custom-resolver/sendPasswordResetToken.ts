import { Context } from ".keystone/types";
import { issuePhoneNumberToken } from "../lib/issuePhoneNumberToken";

export const sendPasswordResetToken = async (
  root: any,
  { phoneNumber }: { phoneNumber: string },
  context: Context
) => {
  const sudoContext = context.sudo();

  const user = await sudoContext.db.User.findOne({
    where: { phoneNumber },
  });

  if (!user) {
    throw new Error("User with this phone number doesn't exist!", {
      cause: "Invalid data passed!",
    });
  }

  const { token, issuedAt } = await issuePhoneNumberToken({ phoneNumber });

  await sudoContext.db.User.updateOne({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetIssuedAt: issuedAt,
    },
  });

  const baseUrl = `${process.env.FRONTEND_URL}/reset-password`;
  const passwordResetUrl = new URL(baseUrl);
  passwordResetUrl.searchParams.set("email", user.email);

  return {
    passwordResetUrl,
  };
};
