import { Context } from ".keystone/types";
import { Session } from "../access";

export const queryAuthorizedUser = async (
  root: any,
  args: {},
  context: Context
) => {
  const loggedInUser = context.session as Session;

  if (loggedInUser) {
    return context.db.User.findOne({ where: { id: loggedInUser.itemId } });
  } else {
    return null;
  }
};
