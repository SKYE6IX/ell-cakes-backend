import * as cookie from "cookie";
import { Context } from ".keystone/types";

export function getSessionCartId(context: Context) {
  const COOKIE_NAME = "ell-cake-cart-id";

  const rawCookie = context.req?.headers.cookie ?? "";
  const cookies = cookie.parse(rawCookie);
  const cartId = cookies[COOKIE_NAME] ?? "";

  return cartId;
}
