import { list } from "@keystone-6/core";
import { relationship, timestamp, decimal } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const Cart = list({
  access: {
    operation: allowAll,
  },
  fields: {
    user: relationship({ ref: "User.cart" }),
    cartItems: relationship({ ref: "CartItem.cart", many: true }),
    subTotalAmount: decimal({ precision: 10, scale: 2 }),
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
});
