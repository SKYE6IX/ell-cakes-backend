import { list } from "@keystone-6/core";
import { text, relationship, checkbox } from "@keystone-6/core/fields";
import {
  isAdminOrCustomer,
  isAdminOrEditorOrCustomer,
  canUpdateOrDeleteDeliveryAddress,
} from "../access";

export const DelivaryAddress = list({
  access: {
    operation: {
      create: isAdminOrCustomer,
      query: isAdminOrEditorOrCustomer,
      update: isAdminOrCustomer,
      delete: isAdminOrCustomer,
    },
    filter: {
      update: canUpdateOrDeleteDeliveryAddress,
      delete: canUpdateOrDeleteDeliveryAddress,
    },
  },
  fields: {
    user: relationship({ ref: "User.delivaryAddress", many: false }),
    street: text({ validation: { isRequired: true } }),
    city: text({ validation: { isRequired: true } }),
    postalCode: text({ validation: { isRequired: true } }),
    isDefault: checkbox({ defaultValue: true }),
  },
});
