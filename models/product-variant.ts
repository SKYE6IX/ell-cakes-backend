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
    price: integer({ validation: { isRequired: true }, label: "цена" }),
    pieces: integer({ defaultValue: undefined, label: "порции" }),
    weight: decimal({
      precision: 4,
      scale: 1,
      defaultValue: undefined,
      label: "вес",
    }),
    isAvailable: checkbox({ defaultValue: true, label: "в наличии" }),
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
