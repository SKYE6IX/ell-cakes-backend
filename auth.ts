import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { getSecret } from "./lib/getSecret";

const isStaging = process.env.NODE_ENV === "staging";
const isProduction = process.env.NODE_ENV === "production";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: "role",
  ...((!isProduction || !isStaging) && {
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
  secure: isProduction || isStaging,
  sameSite: isProduction || isStaging ? "none" : "lax",
  domain: isProduction || isStaging ? process.env.ALLOW_DOMAIN : "",
});

export { withAuth, session };
