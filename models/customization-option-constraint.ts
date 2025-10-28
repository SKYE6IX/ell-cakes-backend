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
      label: "Параметр",
    }),
    // Currently we only have weight contraint that depend on a value of shape
    minValue: decimal({
      precision: 4,
      scale: 1,
      defaultValue: undefined,
      label: "Минимальное значение",
    }),
    maxValue: decimal({
      precision: 4,
      scale: 1,
      defaultValue: undefined,
      label: "Максимальное значение",
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
