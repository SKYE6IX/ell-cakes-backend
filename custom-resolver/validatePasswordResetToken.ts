import bcrypt from "bcryptjs";
import { Context } from ".keystone/types";

export const validatePasswordResetToken = async (
  root: any,
  { token, phoneNumber }: { token: string; phoneNumber: string },
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

  const match = await bcrypt.compare(token, user.passwordResetToken as string);

  if (!match) {
    throw new Error("Invalid token!", { cause: "Failed on bcrypt" });
  }

  const issuedAt = user.passwordResetIssuedAt;
  const expiration = 30 * 60 * 1000;

  if (issuedAt && new Date(issuedAt).getTime() + expiration < Date.now()) {
    throw new Error("Token expired!");
  }

  return match;
};
