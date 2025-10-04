import { list } from "@keystone-6/core";
import { text, relationship, checkbox } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const Address = list({
  access: allowAll,
  fields: {
    user: relationship({ ref: "User.addresses", many: false }),
    street: text({ validation: { isRequired: true } }),
    city: text({ validation: { isRequired: true } }),
    postalCode: text({ validation: { isRequired: true } }),
    // orders: relationship({ ref: "Order.shippingAddress", many: true }),
  },
  ui: {
    isHidden: true,
  },
});
