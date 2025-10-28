import { randomBytes } from "crypto";
import { list } from "@keystone-6/core";
import {
  text,
  password,
  timestamp,
  relationship,
  select,
  checkbox,
} from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

const hiddenFieldConfig = {
  ui: {
    createView: { fieldMode: "hidden" },
    itemView: { fieldMode: "hidden" },
    listView: { fieldMode: "hidden" },
  },
} as const;

export const User = list({
  access: {
    operation: {
      ...allOperations(hasSession),
      create: permissions.canManageUsers,
      delete: permissions.canManageUsers,
    },
    filter: {
      query: rules.canReadUser,
      update: rules.canUpdateUser,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: "unique",
    }),
    isEmailVerified: checkbox({ defaultValue: false }),
    emailVerificationToken: password(hiddenFieldConfig),
    emailVerificationIssuedAt: timestamp(hiddenFieldConfig),
    emailVerificationRedeemedAt: timestamp(hiddenFieldConfig),
    phoneNumber: text({
      isIndexed: "unique",
    }),
    password: password({ validation: { isRequired: true } }),
    role: select({
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Editor", value: "EDITOR" },
        { label: "Customer", value: "CUSTOMER" },
      ],
      defaultValue: "CUSTOMER",
      validation: { isRequired: true },
      ui: { displayMode: "select" },
    }),
    passwordResetToken: password({
      ...hiddenFieldConfig,
      access: () => false,
    }),
    passwordResetIssuedAt: timestamp({
      ...hiddenFieldConfig,
      access: () => false,
    }),
    passwordResetRedeemedAt: timestamp({
      ...hiddenFieldConfig,
      access: () => false,
    }),
    firstOrderDiscountEligible: checkbox({
      defaultValue: true,
      label: "Eligible for 15% off on first order",
      access: {
        update: permissions.canManageUsers,
      },
    }),
    delivaryAddress: relationship({
      ref: "DelivaryAddress.user",
      many: true,
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
    cart: relationship({
      ref: "Cart.user",
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
    orders: relationship({
      ref: "Order.user",
      many: true,
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
    payments: relationship({
      ref: "Payment.user",
      many: true,
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
    lastLogin: timestamp({
      defaultValue: undefined,
      ui: {
        itemView: {
          fieldMode: "read",
        },
        createView: {
          fieldMode: "hidden",
        },
      },
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
  // hooks: {
  //   resolveInput: {
  //     create: async ({ resolvedData }) => {
  //       if (resolvedData.role === "CUSTOMER") {
  //         const token = randomBytes(32).toString("hex");
  //         const issuedAt = new Date();
  //         await sendVerificationEmail({
  //           to: resolvedData.email,
  //           token: token,
  //         });
  //         return {
  //           ...resolvedData,
  //           emailVerificationToken: token,
  //           emailVerificationIssuedAt: issuedAt,
  //         };
  //       }
  //       return resolvedData;
  //     },
  //   },
  // },
  ui: {
    isHidden: ({ session }) => {
      if (session.data.role === "ADMIN") {
        return false;
      }
      return true;
    },
  },
});
