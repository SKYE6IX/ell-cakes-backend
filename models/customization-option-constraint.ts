import { list } from "@keystone-6/core";
import {
  select,
  timestamp,
  decimal,
  relationship,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const CustomizationOptionConstraint = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    optionValues: relationship({
      ref: "CustomizationOptionValue.optionConstraint",
      many: true,
    }),
    key: select({
      options: [{ label: "Weight", value: "weight" }],
      defaultValue: undefined,
      label: "Option Constraint",
    }),
    minValue: decimal({
      precision: 3,
      scale: 1,
      defaultValue: undefined,
    }),
    maxValue: decimal({
      precision: 3,
      scale: 1,
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
