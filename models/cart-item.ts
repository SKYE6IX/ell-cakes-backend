import { list } from "@keystone-6/core";
import {
  relationship,
  integer,
  timestamp,
  json,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const CartItem = list({
  access: {
    operation: allowAll,
  },
  fields: {
    cart: relationship({ ref: "Cart.cartItems" }),
    product: relationship({ ref: "Product.cartItems" }),
    variant: relationship({ ref: "ProductVariant" }),
    topping: relationship({ ref: "ToppingOption.cartItems" }),
    quantity: integer({ defaultValue: 1 }),
    unitPrice: integer(),
    subTotal: integer(),
    productSnapShot: json(),
    variantSnapShot: json(),
    customizationSnapShot: json(),
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
