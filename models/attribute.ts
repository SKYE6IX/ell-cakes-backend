import { list } from "@keystone-6/core";
import { relationship, timestamp, text } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const Attribute = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    productFilling: relationship({ ref: "ProductFilling.attribute" }),
    productAttributes: relationship({
      ref: "ProductAttribute.attribute",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["value", "product"],
        inlineCreate: {
          fields: ["value", "product"],
        },
        inlineEdit: {
          fields: ["value", "product"],
        },
        linkToItem: true,
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
    beforeOperation: {
      delete: async ({ context, item }) => {
        const attribute = await context.query.Attribute.findOne({
          where: { id: item.id.toString() },
          query: "id productAttributes { id }",
        });
        await context.query.ProductAttribute.deleteMany({
          where: attribute.productAttributes.map((v: { id: string }) => ({
            id: v.id,
          })),
        });
      },
    },
  },
  ui: {
    isHidden: true,
  },
});
