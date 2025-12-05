import { Context } from ".keystone/types";

export const isPhoneNumberInUse = async (
  root: any,
  { phoneNumber }: { phoneNumber: string },
  context: Context
) => {
  const sudoContext = context.sudo();
  const phoneNumberCount = await sudoContext.db.User.count({
    where: {
      phoneNumber: { equals: phoneNumber, mode: "insensitive" },
      NOT: { phoneNumber: { equals: "" } },
    },
  });
  return !!phoneNumberCount;
};
