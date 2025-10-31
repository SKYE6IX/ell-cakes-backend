import bcrypt from "bcryptjs";
import { Context } from ".keystone/types";

export const verifyUserByPhoneNumber = async (
  root: any,
  { token, phoneNumber }: { token: string; phoneNumber: string },
  context: Context
) => {
  const user = await context.db.User.findOne({
    where: { phoneNumber: phoneNumber },
  });

  // Check if USER with this number exist!
  if (!user) {
    throw new Error("User with this phone number doesn't exist!");
  }

  // Compare the token with the harsh saved on database
  const match = await bcrypt.compare(token, user.phoneNumberToken as string);
  if (!match) {
    throw new Error("Invalid token");
  }

  // Check and compare the expiration since the token issued
  const issuedAt = user.phoneNumberVerificationIssuedAt;
  const expiration = 30 * 60 * 1000;
  if (issuedAt && new Date(issuedAt).getTime() + expiration < Date.now()) {
    throw new Error("Token expired");
  }
  try {
    await context.db.User.updateOne({
      where: { id: user.id },
      data: {
        isPhoneNumberVerified: true,
        phoneNumberToken: null,
        phoneNumberVerificationIssuedAt: null,
        phoneNumberVerificationRedeemedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    // @ts-expect-error error has an unknow type
    throw new Error(error.message);
  }
  return {
    status: true,
    message: "Successfully verified user",
  };
};
