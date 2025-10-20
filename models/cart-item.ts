import { list } from "@keystone-6/core";
import {
  relationship,
  integer,
  timestamp,
  json,
  decimal,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const CartItem = list({
  access: {
    operation: allowAll,
  },
  fields: {
    cart: relationship({ ref: "Cart.cartItems" }),
    product: relationship({ ref: "Product" }),
    variant: relationship({ ref: "ProductVariant" }),
    topping: relationship({ ref: "Topping" }),
    quantity: integer({ defaultValue: 1 }),
    unitPrice: decimal({
      precision: 10,
      scale: 2,
    }),
    totalPrice: decimal({
      precision: 10,
      scale: 2,
    }),
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
