import { createAuth } from "@keystone-6/auth";
import { storedSessions } from "@keystone-6/core/session";
import { RedisClientType } from "@redis/client";
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

function redisSessionStrategy(redis: RedisClientType) {
  return storedSessions({
    maxAge: sessionMaxAge,
    secret: secretKey,
    store: ({ maxAge }) => ({
      async get(sessionId) {
        const result = await redis.get(sessionId);
        if (!result) return;
        return JSON.parse(result);
      },
      async set(sessionId, data) {
        await redis.setEx(sessionId, maxAge, JSON.stringify(data));
      },
      async delete(sessionId) {
        await redis.del(sessionId);
      },
    }),
  });
}

export { withAuth, redisSessionStrategy };
