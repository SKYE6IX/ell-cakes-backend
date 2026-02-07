import { list } from "@keystone-6/core";
import { relationship, timestamp, text } from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

export const OrderReceiver = list({
  access: {
    operation: {
      ...allOperations(hasSession),
    },
    filter: {
      update: permissions.canManageOrder,
      delete: permissions.canManageOrder,
    },
  },

  fields: {
    benefactor: relationship({ ref: "User.orderBeneficiaries", many: false }),
    order: relationship({ ref: "Order.orderReceiver", many: false }),
    name: text({ validation: { isRequired: true }, label: "Имя" }),
    phoneNumber: text({
      validation: { isRequired: true },
      label: "Номер телефона",
    }),
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
  ui: {
    isHidden: true,
    createView: {
      defaultFieldMode: "hidden",
    },
  },
});
