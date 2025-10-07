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
import {
  isAdmin,
  canReadProfile,
  isAdminOrEditorOrCustomer,
  isAdminOrEditor,
  canUpdateProfile,
} from "../access";
import { sendVerificationEmail } from "../lib/mail";

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
      create: () => true,
      query: isAdminOrEditorOrCustomer,
      update: isAdminOrEditorOrCustomer,
      delete: isAdmin,
    },
    filter: {
      query: canReadProfile,
    },
    item: {
      update: canUpdateProfile,
    },
  },
  fields: {
    firstName: text({ validation: { isRequired: true } }),
    lastName: text({ validation: { isRequired: true } }),
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
      validation: { isRequired: false },
    }),
    password: password({ validation: { isRequired: true } }),
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
    firstOrderDiscountEligible: checkbox({
      defaultValue: true,
      label: "Eligible for 10% off on first order",
      access: {
        read: isAdminOrEditorOrCustomer,
        update: isAdminOrEditor,
      },
    }),
    delivaryAddress: relationship({ ref: "DelivaryAddress.user", many: true }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        createView: {
          fieldMode: "hidden",
        },
      },
    }),
    lastLogin: timestamp({
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
