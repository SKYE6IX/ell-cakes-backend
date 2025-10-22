import { list } from "@keystone-6/core";
import { relationship, timestamp, integer } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const Cart = list({
  access: {
    operation: allowAll,
  },
  fields: {
    user: relationship({ ref: "User.cart" }),
    cartItems: relationship({ ref: "CartItem.cart", many: true }),
    subTotal: integer(),
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
  hooks: {
    beforeOperation: {
      delete: async ({ context, item }) => {
        const cart = await context.query.Cart.findOne({
          where: { id: item.id.toString() },
          query: "id cartItems { id }",
        });
        await context.query.CartItem.deleteMany({
          where: cart.cartItems.map((v: { id: any }) => ({ id: v.id })),
        });
      },
    },
  },
});
