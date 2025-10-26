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
    cartItems: relationship({ ref: "CartItem.topping", many: true }),
    weight: decimal({
      precision: 5,
      scale: 3,
      defaultValue: undefined,
    }),
    pieces: integer({ defaultValue: undefined }),
    extraPrice: integer({ validation: { isRequired: true } }),
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
