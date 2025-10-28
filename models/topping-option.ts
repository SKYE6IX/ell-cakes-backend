import { list } from "@keystone-6/core";
import {
  relationship,
  integer,
  timestamp,
  decimal,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const ToppingOption = list({
  access: allowAll,
  fields: {
    topping: relationship({ ref: "Topping.options", many: false }),
    cartItems: relationship({
      ref: "CartItem.topping",
      many: true,
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
    weight: decimal({
      precision: 5,
      scale: 3,
      defaultValue: undefined,
      label: "вес",
    }),
    pieces: integer({ defaultValue: undefined, label: "порций" }),
    extraPrice: integer({ validation: { isRequired: true }, label: "доплата" }),
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
