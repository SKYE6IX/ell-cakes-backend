import { customAlphabet } from "nanoid";
import { sendUserVerificationToken, sendResetPasswordToken } from "./mail";

export const issueVerificationToken = async ({
  email,
  type,
}: {
  email: string;
  type: "user-verification" | "password-reset";
}) => {
  const nanoid = customAlphabet("0123456789", 6);

  const token = nanoid();

  const issuedAt = new Date();

  if (type === "user-verification") {
    await sendUserVerificationToken({ to: email, token });
  } else if (type) {
    await sendResetPasswordToken({ to: email, token });
  }

  return {
    token,
    issuedAt,
  };
};
