import { randomBytes } from "crypto";
import { list, graphql } from "@keystone-6/core";
import {
  text,
  password,
  timestamp,
  relationship,
  select,
  checkbox,
  virtual,
} from "@keystone-6/core/fields";
import { allOperations, allowAll } from "@keystone-6/core/access";
import { sendVerificationEmail } from "../lib/mail";
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
      create: allowAll,
      delete: permissions.canManageUsers,
    },
    filter: {
      query: rules.canReadUser,
      update: rules.canUpdateUser,
    },
  },
  fields: {
    firstName: text({ validation: { isRequired: true } }),
    lastName: text({ validation: { isRequired: true } }),
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, args, context) {
          const { firstName, lastName } = await context.query.User.findOne({
            // @ts-expect-error "item" has unknow type
            where: { id: item.id.toString() },
            query: "firstName lastName",
          });
          return firstName + " " + lastName;
        },
      }),
    }),
    email: text({
      validation: { isRequired: false },
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
    delivaryAddress: relationship({ ref: "DelivaryAddress.user", many: true }),
    cart: relationship({ ref: "Cart.user" }),
    orders: relationship({ ref: "Order.user", many: true }),
    payments: relationship({ ref: "Payment.user", many: true }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
    lastLogin: timestamp({
      defaultValue: undefined,
      ui: {
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
  },
  hooks: {
    resolveInput: {
      create: async ({ resolvedData }) => {
        if (resolvedData.role === "CUSTOMER") {
          const token = randomBytes(32).toString("hex");
          const issuedAt = new Date();
          await sendVerificationEmail({
            to: resolvedData.email,
            token: token,
          });
          return {
            ...resolvedData,
            emailVerificationToken: token,
            emailVerificationIssuedAt: issuedAt,
          };
        }
        return resolvedData;
      },
    },
  },
});
