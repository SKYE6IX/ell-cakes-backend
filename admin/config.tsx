import type { AdminConfig } from "@keystone-6/core/types";
import CustomLogo from "./components/CustomLogo";

export const components: AdminConfig["components"] = {
  Logo: CustomLogo,
};
