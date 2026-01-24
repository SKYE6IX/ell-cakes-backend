import { list, graphql } from "@keystone-6/core";
import {
  relationship,
  timestamp,
  text,
  select,
  integer,
  virtual,
} from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

// TODO:
// 1. Set up a field where we render a formated string to display all about order details
// that isn't included on this fields.✅
// 2. Intregration with CRM, we need to come up with a soluton on how we cant integrate with CRM
// without bloating about 400 plus more variants.
// 3. Notification setup for new order for store owner. Perhaps an email, or maybe connection with
// CRM will enough?

const potentialCols = [
  { label: "Продукта", key: "product.name" },
  { label: "Количество", key: "quantity" },
  { label: "Вес", key: "variant.weight" },
  { label: "Порции", key: "variant.pieces" },
  { label: "Размер", key: "variant.size" },
  { label: "Топпинг", key: "toppingOption.weight" },
  { label: "Кастомизация", key: "customizations" },
  { label: "Варианты микс-боксов", key: "compositions" },
  { label: "Количество", key: "subTotal" },
];

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
    orderIntent: relationship({
      ref: "OrderIntent.order",
      many: false,
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
      },
    }),

    user: relationship({
      ref: "User.orders",
      many: false,
      ui: {
        itemView: {
          fieldMode: "read",
        },
        displayMode: "cards",
        cardFields: ["name", "email", "phoneNumber"],
      },
    }),

    orderDetails: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, args, context) {
          const orderItems = await context.query.OrderItem.findMany({
            // @ts-expect-error Type of ITEM isn't available
            where: { order: { id: { equals: item.id.toString() } } },
            query:
              "quantity subTotal product { name topping { name } } variant { weight pieces size filling { name } } toppingOption { weight } customizations compositions",
          });

          const customizeImages = await context.query.CustomizeImage.findMany({
            query: "id image { url }",
          });

          if (!orderItems.length) return "<p>No items in this order.</p>";

          const getValue = (obj: any, path: string) =>
            path.split(".").reduce((o, i) => o?.[i], obj);
          const activeCols = potentialCols.filter((col) =>
            orderItems.some((oi) => {
              const val = getValue(oi, col.key);
              return val !== null && val !== undefined && val !== "";
            })
          );

          return `
              <table style="width:70vw; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
                <thead>
                  <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
                    ${activeCols
                      .map(
                        (c) =>
                          `<th style="padding: 5px; text-align: left;">${c.label}</th>`
                      )
                      .join("")}
                  </tr>
                </thead>

                <tbody>
                  ${orderItems
                    .map((oi) => {
                      return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      ${activeCols
                        .map((c) => {
                          if (c.key === "toppingOption.weight") {
                            return `<td style="padding: 8px;">
                            ${oi.product.topping.name} (${getValue(
                              oi,
                              c.key
                            )}кг)
                          </td>`;
                          } else if (c.key === "customizations") {
                            return `<td style="padding: 8px;">   
                            ${oi.customizations
                              .map((cus: any) => {
                                const { value, inscriptionText, imagesId } =
                                  cus.customValue;

                                let imagesUrl: string[] = [];
                                if (imagesId && imagesId.length >= 1) {
                                  imagesUrl = imagesId?.map((id: string) => {
                                    const imageItem = customizeImages.find(
                                      (img) => img.id === id
                                    );
                                    return imageItem?.image.url;
                                  });
                                }
                                return `
                                <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 2px">
                                 <span>Тип: ${cus.name}</span><br/>
                                 ${
                                   value
                                     ? `<span>Ценить: ${value}</span><br/>`
                                     : ""
                                 }
                                    ${
                                      inscriptionText
                                        ? `<span>Надпись: ${inscriptionText}</span>`
                                        : ""
                                    }
                                  ${
                                    imagesUrl.length
                                      ? `Фотоссылка: ${imagesUrl
                                          .map(
                                            (url) =>
                                              `<a href="${url}" target="_blank">Ссылка</a>`
                                          )
                                          .join(",")}`
                                      : ""
                                  }  
                                </div>
                                `;
                              })
                              .join("")} 
                              </td>`;
                          } else if (c.key === "product.name") {
                            return `<td style="padding: 8px; width: 300px;">
                            ${getValue(oi, c.key)} (${oi.variant.filling.name})
                            </td>`;
                          } else {
                            return `<td style="padding: 8px;">${
                              getValue(oi, c.key) || "-"
                            }</td>`;
                          }
                        })
                        .join("")}
                    </tr>
                  `;
                    })
                    .join("")}
                </tbody>
              </table>`;
        },
      }),
      ui: {
        views: "./admin/views/OrderDetails.tsx",
        itemView: {
          fieldMode: "read",
        },
      },
      label: "Детали заказа",
    }),

    orderItems: relationship({
      ref: "OrderItem.order",
      many: true,
      ui: {
        itemView: {
          fieldMode: "hidden",
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
        cardFields: ["address", "apartmentNumber", "floor", "intercomCode"],
      },
    }),

    note: text({
      ui: {
        itemView: {
          fieldMode: "read",
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

  ui: {
    listView: {
      initialColumns: [
        "orderNumber",
        "totalAmount",
        "status",
        "payment",
        "createdAt",
      ],
      initialSort: { field: "createdAt", direction: "DESC" },
    },
  },
});
