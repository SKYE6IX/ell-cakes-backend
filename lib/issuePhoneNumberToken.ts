import { customAlphabet } from "nanoid";
import { sendSms } from "./sendSms";

export const issuePhoneNumberToken = async ({
  phoneNumber,
}: {
  phoneNumber: string;
}) => {
  const nanoid = customAlphabet("0123456789", 6);

  const token = nanoid();

  const issuedAt = new Date();

  const message = `Код для подтверждения: ${token} ELLCAKES`;

  await sendSms({ phoneNumber, message });

  return {
    token,
    issuedAt,
  };
};
