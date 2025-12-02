import { Context } from ".keystone/types";
import { getSessionCartId } from "../lib/getSessionCartId";
import type { Session } from "../access";

export const queryCart = async (root: any, args: {}, context: Context) => {
  const sudoContext = context.sudo();
  const loggedInUser = context.session as Session;
  const sessionCartId = getSessionCartId(context);

  if (loggedInUser) {
    return sudoContext.db.Cart.findOne({
      where: { user: { id: loggedInUser.itemId } },
    });
  } else if (sessionCartId) {
    return sudoContext.db.Cart.findOne({
      where: { sessionId: sessionCartId },
    });
  }
  return null;
};
