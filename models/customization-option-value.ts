import { list } from "@keystone-6/core";
import {
  text,
  timestamp,
  integer,
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
    value: text({ defaultValue: undefined, label: "Значение" }),
    extraPrice: integer({ defaultValue: undefined, label: "Доплата" }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        itemView: {
          fieldMode: "read",
        },
        createView: { fieldMode: "hidden" },
      },
    }),
    updatedAt: timestamp({
      ui: {
        itemView: {
          fieldMode: "read",
        },
        createView: { fieldMode: "hidden" },
      },
    }),
  },
  ui: {
    isHidden: true,
  },
});
