import { list } from "@keystone-6/core";
import { text, relationship, checkbox } from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, rules, permissions } from "../access";

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
    user: relationship({ ref: "User.delivaryAddress", many: false }),
    street: text({ validation: { isRequired: true } }),
    city: text({ validation: { isRequired: true } }),
    postalCode: text({ validation: { isRequired: true } }),
    isDefault: checkbox({ defaultValue: true }),
  },
  ui: {
    isHidden: true,
  },
});
