import { Context } from ".keystone/types";
import { getSessionId } from "../lib/getSessionId";
import type { Session } from "../access";

export const queryCart = async (root: any, args: {}, context: Context) => {
  const sudoContext = context.sudo();
  const loggedInUser = context.session as Session;
  const sessionId = await getSessionId(context);

  if (loggedInUser) {
    return sudoContext.db.Cart.findOne({
      where: { user: { id: loggedInUser.itemId } },
    });
  } else if (sessionId) {
    return sudoContext.db.Cart.findOne({
      where: { sessionId },
    });
  }
  return null;
};
