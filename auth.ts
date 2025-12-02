import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { sendResetPasswordTokenEmail } from "./lib/mail";
import { getSecret } from "./lib/getSecret";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: "role",
  initFirstItem: {
    fields: ["name", "email", "password", "role"],
  },
  passwordResetLink: {
    sendToken: async ({ identity, token }) => {
      await sendResetPasswordTokenEmail({ to: identity, token: token });
    },
    tokensValidForMins: 60,
  },
});

const secretKey = getSecret("SESSION_SECRET");
const sessionMaxAge = 60 * 60 * 24 * 30;
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: secretKey,
});

export { withAuth, session };
