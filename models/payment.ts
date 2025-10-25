import { list } from "@keystone-6/core";
import {
  relationship,
  timestamp,
  text,
  integer,
} from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession } from "../access";

export const Payment = list({
  access: {
    operation: {
      ...allOperations(hasSession),
    },
  },
  fields: {
    user: relationship({ ref: "User.payments" }),
    order: relationship({ ref: "Order.payment" }),
    paymentId: text({ isIndexed: "unique" }),
    confirmationUrl: text(),
    amount: text(),
    method: text(),
    status: text({ defaultValue: "pending" }),
    paidAt: timestamp(),
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
