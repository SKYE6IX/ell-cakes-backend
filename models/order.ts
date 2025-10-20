import { list } from "@keystone-6/core";
import {
  relationship,
  timestamp,
  text,
  decimal,
  select,
} from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

export const Order = list({
  access: {
    operation: {
      ...allOperations(hasSession),
    },
    filter: {
      query: rules.canReadOrder,
      update: permissions.canManageOrder,
      delete: permissions.canManageOrder,
    },
  },
  fields: {
    user: relationship({ ref: "User.orders" }),
    orderItems: relationship({ ref: "OrderItem.order", many: true }),
    orderNumber: text({ isIndexed: "unique" }),
    shippingCost: decimal({ precision: 10, scale: 2 }),
    subTotalAmount: decimal({ precision: 10, scale: 2 }),
    totalAmount: decimal({ precision: 10, scale: 2 }),
    status: select({
      options: [
        { label: "Processing", value: "PROCESSING" },
        { label: "Shipped", value: "SHIPPED" },
        { label: "Delivered", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
      defaultValue: "PROCESSING",
    }),
    message: text(),
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
