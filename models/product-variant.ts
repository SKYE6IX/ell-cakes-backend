import { list, graphql } from "@keystone-6/core";
import {
  relationship,
  integer,
  timestamp,
  decimal,
  virtual,
  text,
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

    size: text({ defaultValue: undefined, label: "Размер" }),

    price: integer({ validation: { isRequired: true }, label: "Цена" }),

    serving: integer({ label: "Порции" }),

    selectedValue: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, args, context) {
          // @ts-expect-error ID type doesn't exist on item
          if (item.weight) return `Вес: ${item.weight}кг`;
          // @ts-expect-error ID type doesn't exist on item
          if (item.pieces) return `Порции: ${item.pieces}шт`;
          // @ts-expect-error ID type doesn't exist on item
          if (item.size) return `Размер: ${item.size}см`;
        },
      }),
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),

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
    labelField: "selectedValue",
  },
});
