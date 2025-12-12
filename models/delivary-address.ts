import { list } from "@keystone-6/core";
import { text, relationship, timestamp } from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, rules } from "../access";

export const DelivaryAddress = list({
  access: {
    operation: {
      ...allOperations(hasSession),
    },
    filter: {
      update: rules.canManageDeliveryAddress,
      delete: rules.canManageDeliveryAddress,
    },
  },
  fields: {
    user: relationship({ ref: "User.delivaryAddress" }),
    orders: relationship({ ref: "Order.deliveryAddress", many: true }),
    street: text({ validation: { isRequired: true } }),
    apartmentNumber: text(),
    floor: text(),
    intercomCode: text(),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        itemView: {
          fieldMode: "read",
        },
        createView: { fieldMode: "hidden" },
      },
    }),
    updatedAt: timestamp({
      ui: {
        itemView: {
          fieldMode: "read",
        },
        createView: { fieldMode: "hidden" },
      },
    }),
  },

  // ui: {
  //   isHidden: true,
  // },
});
