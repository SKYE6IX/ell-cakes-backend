import { Context } from ".keystone/types";
import { sendRequestCall } from "../lib/mail";

export const requestCall = async (
  root: any,
  { phoneNumber }: { phoneNumber: string },
  context: Context
) => {
  await sendRequestCall({ phoneNumber });

  return "Request Sent!";
};
