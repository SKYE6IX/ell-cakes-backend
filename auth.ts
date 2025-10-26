import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { sendResetPasswordTokenEmail } from "./lib/mail";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: "role",
  initFirstItem: {
    fields: ["name", "email", "password", "role"],
  },
  passwordResetLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
      await sendResetPasswordTokenEmail({ to: identity, token: token });
    },
    tokensValidForMins: 60,
  },
});
const sessionMaxAge = 60 * 60 * 24 * 30;
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: process.env.SESSION_SECRET,
});

export { withAuth, session };
