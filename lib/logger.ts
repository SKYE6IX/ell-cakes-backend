import pino from "pino";
import PinoHttp from "pino-http";
import { randomUUID } from "crypto";

export const pinoLogger = PinoHttp({
  logger: pino(),

  genReqId: (req, res) => {
    const existingID = req.id ?? req.headers["x-request-id"];
    if (existingID) return existingID;
    const id = randomUUID();
    res.setHeader("X-Request-Id", id);
    return id;
  },

  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return "silent";
    }
    return "info";
  },
});
