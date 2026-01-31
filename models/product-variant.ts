import { list } from "@keystone-6/core";
import {
  relationship,
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
    filling: relationship({ ref: "ProductFilling.variants" }),

    weight: decimal({
      precision: 4,
      scale: 1,
      defaultValue: undefined,
      label: "Вес",
    }),

    pieces: integer({ defaultValue: undefined, label: "Штук" }),

    size: integer({ defaultValue: undefined, label: "Размер" }),

    price: integer({
      validation: { isRequired: true },
      label: "Цена",
    }),

    serving: integer({ label: "Порции" }),

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
    isHidden: !permissions.canManageAll,
    labelField: "price",
    listView: {
      initialSort: { field: "price", direction: "ASC" },
    },
  },
});
