import { list } from "@keystone-6/core";
import {
  relationship,
  integer,
  timestamp,
  json,
} from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

export const OrderItem = list({
  access: {
    operation: {
      ...allOperations(hasSession),
    },
    filter: {
      query: rules.canReadOrder,
      update: permissions.canManageOrder,
      delete: permissions.canManageOrder,
    },
  },
  fields: {
    order: relationship({ ref: "Order.orderItems" }),
    product: relationship({ ref: "Product" }),
    variant: relationship({ ref: "ProductVariant" }),
    quantity: integer({ defaultValue: 1 }),
    unitPrice: integer(),
    subTotal: integer(),
    productSnapShot: json(),
    variantSnapShot: json(),
    customizationSnapShot: json(),
    toppingSnapShot: json(),
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
  },
});
