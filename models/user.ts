import { list } from "@keystone-6/core";
import {
  text,
  password,
  timestamp,
  relationship,
  select,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const User = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: "unique",
    }),
    password: password({ validation: { isRequired: true } }),
    role: select({
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Customer", value: "customer" },
      ],
      defaultValue: "customer",
      validation: { isRequired: true },
      ui: { displayMode: "select" },
    }),
    // addresses: relationship({ ref: "Address.user", many: true }),
    // carts: relationship({ ref: "Cart.user", many: true }),
    // orders: relationship({ ref: "Order.user", many: true }),
    // payments: relationship({ ref: "Payment.user", many: true }),
    // reviews: relationship({ ref: "Review.user", many: true }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
    }),
    lastLogin: timestamp(),
  },
});
