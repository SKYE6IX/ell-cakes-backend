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
import { issueVerificationToken } from "../lib/issueVerificationToken";
import { Context } from ".keystone/types";

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
    password: password({ validation: { isRequired: true } }),
    phoneNumber: text({
      isIndexed: "unique",
    }),
    isPhoneNumberVerified: checkbox({ defaultValue: false }),
    phoneNumberToken: password(hiddenFieldConfig),
    phoneNumberVerificationIssuedAt: timestamp(hiddenFieldConfig),
    phoneNumberVerificationRedeemedAt: timestamp(hiddenFieldConfig),
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
  hooks: {
    afterOperation: {
      create: async ({ item, context }) => {
        await issueVerificationToken({
          userId: item.id.toString(),
          context: context as unknown as Context,
        });
      },
      update: async ({ inputData, originalItem, context }) => {
        // Check if USER passed in a new phone number
        // and verify it isn't the same as the existing one they had
        if (
          inputData.phoneNumber &&
          inputData.phoneNumber !== originalItem.phoneNumber
        ) {
          await issueVerificationToken({
            userId: originalItem.id.toString(),
            context: context as unknown as Context,
          });
        }
      },
    },
  },
  ui: {
    isHidden: ({ session }) => {
      if (session.data.role === "ADMIN") {
        return false;
      }
      return true;
    },
  },
});
