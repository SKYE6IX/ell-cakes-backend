import * as cookie from "cookie";
import * as iron from "@hapi/iron";
import { Context } from ".keystone/types";
import { getSecret } from "./getSecret";

export async function getSessionId(context: Context) {
  const COOKIE_NAME = "keystonejs-session";
  const secretKey = getSecret("SESSION_SECRET");

  const rawCookie = context.req?.headers.cookie ?? "";
  const cookies = cookie.parse(rawCookie);
  const encryptedSessionCookie = cookies[COOKIE_NAME] ?? "";

  const unsealed = await iron.unseal(
    encryptedSessionCookie,
    secretKey,
    iron.defaults
  );
  return unsealed;
}
