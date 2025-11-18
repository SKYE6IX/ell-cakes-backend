import { list } from "@keystone-6/core";
import {
  relationship,
  timestamp,
  text,
  select,
  integer,
} from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

export const Order = list({
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
    user: relationship({
      ref: "User.orders",
      ui: {
        itemView: {
          fieldMode: "read",
        },
        displayMode: "cards",
        cardFields: ["name", "email", "phoneNumber"],
      },
    }),
    orderItems: relationship({
      ref: "OrderItem.order",
      many: true,
      ui: {
        itemView: {
          fieldMode: "read",
        },
        displayMode: "cards",
        cardFields: ["product", "variant", "quantity", "unitPrice", "subTotal"],
      },
    }),
    orderNumber: text({
      isIndexed: "unique",
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    shippingCost: integer({
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    subTotalAmount: integer({
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    totalAmount: integer({
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    status: select({
      options: [
        { label: "Processing", value: "PROCESSING" },
        { label: "Shipped", value: "SHIPPED" },
        { label: "Delivered", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
      defaultValue: "PROCESSING",
    }),
    payment: relationship({
      ref: "Payment.order",
      ui: {
        itemView: {
          fieldMode: "read",
        },
        displayMode: "cards",
        cardFields: ["status"],
      },
    }),
    deliveryAddress: relationship({
      ref: "DelivaryAddress.orders",
      ui: {
        itemView: {
          fieldMode: "read",
        },
        displayMode: "cards",
        cardFields: ["street", "apartmentNumber", "floor", "intercomCode"],
      },
    }),
    note: text({
      ui: {
        itemView: {
          fieldMode: "read",
        },
      },
    }),
    orderImages: relationship({
      ref: "OrderImage.order",
      many: true,
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
});
