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
    name: text({ validation: { isRequired: true }, label: "Имя" }),

    email: text({
      validation: { isRequired: true },
      isIndexed: "unique",
      label: "Почта",
    }),

    password: password({ validation: { isRequired: true } }),

    phoneNumber: text({
      isIndexed: "unique",
      defaultValue: null,
      label: "Номер телефона",
    }),

    isUserVerified: checkbox({ defaultValue: false }),

    userVerificationToken: text({
      ...hiddenFieldConfig,
      db: {
        isNullable: true,
      },
    }),

    userVerificationTokenIssuedAt: timestamp(hiddenFieldConfig),

    userVerificationTokenRedeemedAt: timestamp(hiddenFieldConfig),

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

    passwordResetToken: text({
      ...hiddenFieldConfig,
      access: () => false,
      db: {
        isNullable: true,
      },
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
      many: false,
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

    orderBeneficiaries: relationship({
      ref: "OrderReceiver.benefactor",
      many: true,
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
      create: async ({ item, context, inputData }) => {
        const { token, issuedAt } = await issueVerificationToken({
          email: inputData.email,
          type: "user-verification",
        });

        await context.db.User.updateOne({
          where: { id: item.id.toString() },
          data: {
            isUserVerified: false,
            userVerificationToken: token,
            userVerificationTokenIssuedAt: issuedAt,
            userVerificationTokenRedeemedAt: null,
            updatedAt: issuedAt,
          },
        });
      },

      update: async ({ inputData, originalItem, context }) => {
        // Check if USER passed in a new email
        // and verify it isn't the same as the existing one they had
        if (inputData.email && inputData.email !== originalItem.email) {
          const { token, issuedAt } = await issueVerificationToken({
            email: inputData.email,
            type: "user-verification",
          });

          await context.db.User.updateOne({
            where: { id: originalItem.id.toString() },
            data: {
              isUserVerified: false,
              userVerificationToken: token,
              userVerificationTokenIssuedAt: issuedAt,
              userVerificationTokenRedeemedAt: null,
              updatedAt: issuedAt,
            },
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
