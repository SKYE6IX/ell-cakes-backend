import { list } from "@keystone-6/core";
import { relationship, timestamp, text, select } from "@keystone-6/core/fields";
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
    yooMoneyId: text({ isIndexed: "unique" }),
    redirectUrl: text(),
    confirmationUrl: text(),
    amount: text(),
    method: text(),
    status: select({
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Success", value: "SUCCEEDED" },
        { label: "Failed", value: "CANCELED" },
      ],
      defaultValue: "PENDING",
    }),
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
    labelField: "status",
  },
});
