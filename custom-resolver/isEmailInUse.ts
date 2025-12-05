import { Context } from ".keystone/types";

export const isEmailInUse = async (
  root: any,
  { email }: { email: string },
  context: Context
) => {
  const sudoContext = context.sudo();
  const emailCount = await sudoContext.db.User.count({
    where: {
      email: { equals: email, mode: "insensitive" },
    },
  });
  return !!emailCount;
};
