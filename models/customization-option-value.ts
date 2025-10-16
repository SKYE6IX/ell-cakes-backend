import { list } from "@keystone-6/core";
import {
  text,
  timestamp,
  decimal,
  relationship,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const CustomizationOptionValue = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    option: relationship({
      ref: "CustomizationOption.customValues",
      many: false,
    }),
    value: text({ defaultValue: undefined }),
    extraPrice: decimal({
      precision: 10,
      scale: 2,
      defaultValue: undefined,
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        createView: { fieldMode: "hidden" },
      },
    }),
    updatedAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
      },
    }),
  },
  ui: {
    isHidden: true,
  },
});
