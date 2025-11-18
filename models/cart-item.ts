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
    product: relationship({ ref: "Product" }),
    variant: relationship({ ref: "ProductVariant" }),
    toppingOption: relationship({ ref: "ToppingOption" }),
    compositionSnapShot: json(), // We store the a snapshot of the composition to verify if user chose something diffrent
    customizationsSnapShot: json(), // Here is all about the customization the user provided along with the extra prices
    quantity: integer({ defaultValue: 1 }),
    unitPrice: integer(), // Unit price serve as the amount of the product + the customization/topping
    subTotal: integer(), // Subtotal price serve as the total amount of the unitPrice * quantity (For a single cart-item)
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
