import { list } from "@keystone-6/core";
import {
  relationship,
  checkbox,
  integer,
  timestamp,
  decimal,
  json,
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
    filling: relationship({ ref: "ProductFilling.variants", many: false }),
    composition: json({
      label: "Смешанные кексы",
      defaultValue: {
        cupcakeType: "",
        quantity: 0,
      },
    }),
    pieces: integer({ defaultValue: undefined, label: "порции" }),
    weight: decimal({
      precision: 4,
      scale: 1,
      defaultValue: undefined,
      label: "вес",
    }),
    price: integer({ validation: { isRequired: true }, label: "цена" }),
    serving: integer(),
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
