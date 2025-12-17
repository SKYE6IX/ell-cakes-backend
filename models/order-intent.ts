import { list } from "@keystone-6/core";
import {
  relationship,
  timestamp,
  text,
  select,
  integer,
} from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

export const OrderIntent = list({
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
    intentId: text({ isIndexed: "unique" }),
    yooMoneyId: text({ isIndexed: "unique" }),
    cartId: text({ isIndexed: "unique" }),
    userId: text({ isIndexed: "unique" }),
    deliveryAddressId: text({ isIndexed: "unique" }),
    note: text(),
    paymentStatus: select({
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Success", value: "SUCCEEDED" },
        { label: "Failed", value: "CANCELED" },
      ],
      defaultValue: "PENDING",
    }),
    shippingCost: integer(),
    totalAmount: integer(),
    order: relationship({ ref: "Order.orderIntent", many: false }),
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
