import { Context } from ".keystone/types";
import { sendRequestCall, RequestCallFields } from "../lib/mail";

export const requestCall = async (
  root: any,
  { requestCallInput }: { requestCallInput: RequestCallFields },
  context: Context,
) => {
  await sendRequestCall({ requestCallInput });
  return "Request Sent!";
};
