import { Context } from ".keystone/types";
import { customAlphabet } from "nanoid";

export const issueVerificationToken = async ({
  userId,
  context,
}: {
  userId: string;
  context: Context;
}) => {
  const sudoContext = context.sudo();
  const nanoid = customAlphabet("0123456789", 6);
  const token = nanoid();

  console.log("Here is newly created token: -> ", token);
  const issuedAt = new Date();
  try {
    await sudoContext.db.User.updateOne({
      where: { id: userId },
      data: {
        isPhoneNumberVerified: false,
        phoneNumberToken: token,
        phoneNumberVerificationIssuedAt: issuedAt,
        phoneNumberVerificationRedeemedAt: null,
        updatedAt: issuedAt,
      },
    });
    // TODO:
    // 1. Set up SMS service that will send the token to the USER phone number
  } catch (error) {
    console.log(error);
    throw new Error("Error happened while trying to issued a token!");
  }
};
