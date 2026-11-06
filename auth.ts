import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { getSecret } from "./lib/getSecret";

const isProduction = process.env.NODE_ENV === "production";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: "role",
  ...(!isProduction && {
    initFirstItem: {
      fields: ["name", "email", "password", "role"],
    },
  }),
});

const secretKey = getSecret("SESSION_SECRET");

const sessionMaxAge = 60 * 60 * 24 * 30;

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: secretKey,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  domain: isProduction ? ".ellcakes.ru" : "",
});

export { withAuth, session };
