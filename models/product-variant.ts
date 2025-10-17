import { list } from "@keystone-6/core";
import {
  relationship,
  checkbox,
  integer,
  timestamp,
  decimal,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const ProductVariant = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    product: relationship({ ref: "Product.variants", many: false }),
    price: decimal({
      precision: 10,
      scale: 2,
      validation: { isRequired: true },
    }),
    pieces: integer({ defaultValue: undefined }),
    weight: decimal({
      precision: 3,
      scale: 1,
      defaultValue: undefined,
    }),
    stockQuantity: integer({
      defaultValue: undefined,
      validation: { isRequired: true },
    }),
    isAvailable: checkbox({ defaultValue: true }),
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
