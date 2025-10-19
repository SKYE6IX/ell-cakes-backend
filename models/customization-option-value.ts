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
    name: text({ defaultValue: undefined }),
    extraPrice: decimal({
      precision: 10,
      scale: 2,
      defaultValue: undefined,
    }),
    optionConstraint: relationship({
      ref: "CustomizationOptionConstraint.optionValues",
      many: false,
      ui: {
        displayMode: "cards",
        cardFields: ["key", "minValue", "maxValue"],
        inlineCreate: {
          fields: ["key", "minValue", "maxValue"],
        },
        inlineEdit: {
          fields: ["key", "minValue", "maxValue"],
        },
        linkToItem: true,
      },
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
