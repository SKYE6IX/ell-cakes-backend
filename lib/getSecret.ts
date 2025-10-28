import fs from "node:fs";

export const getSecret = (name: string) => {
  const fileEnv = process.env[`${name}_FILE`];
  if (fileEnv) {
    return fs.readFileSync(fileEnv, "utf8").trim();
  }
  return process.env[name] as string;
};
