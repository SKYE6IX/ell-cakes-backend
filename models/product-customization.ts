import { list } from "@keystone-6/core";
import { timestamp, relationship } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const ProductCustomization = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    product: relationship({ ref: "Product.customization", many: false }),
    customOptions: relationship({ ref: "CustomizationOption", many: true }),
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
  hooks: {
    beforeOperation: {
      delete: async ({ context, item }) => {
        const productCustomization =
          await context.query.ProductCustomization.findOne({
            where: { id: item.id.toString() },
            query: "id customOptions { id }",
          });
        await context.query.CustomizationOption.deleteMany({
          where: productCustomization.customOptions.map((v: { id: any }) => ({
            id: v.id,
          })),
        });
      },
    },
  },
});
