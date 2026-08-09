import { list } from "@keystone-6/core";
import { relationship, timestamp, text, select, integer } from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

export const OrderIntent = list({
  access: {
    operation: {
      ...allOperations(hasSession),
    },
    filter: {
      query: () => {
        return { paymentStatus: { equals: "PENDING" } };
      },
      update: permissions.canManageOrder,
      delete: permissions.canManageOrder,
    },
  },
  fields: {
    intentId: text({ isIndexed: "unique" }),
    yooMoneyId: text({ isIndexed: "unique" }),
    paymentId: text(),
    cart: relationship({ ref: "Cart" }),
    user: relationship({ ref: "User" }),
    orderReceiver: relationship({ ref: "OrderReceiver" }),
    deliveryAddress: relationship({ ref: "DelivaryAddress" }),
    deliveryOption: text(),
    deliveryDate: timestamp({
      ui: {
        itemView: {
          fieldMode: "read",
        },
        createView: { fieldMode: "hidden" },
      },
      label: "Дата доставки",
    }),
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
  ui: {
    isHidden: ({ session }) => {
      if (session.data.role === "ADMIN") {
        return false;
      }
      return true;
    },
    listView: {
      defaultFieldMode: "read",
      initialColumns: ["user", "paymentStatus", "totalAmount", "createdAt"],
    },
  },
});
