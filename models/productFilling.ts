import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  integer,
  timestamp,
  decimal,
  image,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const ProductFilling = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    product: relationship({ ref: "Product.fillings" }),
    variants: relationship({
      label: "Вариант продукта",
      ref: "ProductVariant.filling",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["composition", "weight", "pieces", "price", "isAvailable"],
        inlineCreate: {
          fields: ["composition", "weight", "pieces", "price", "isAvailable"],
        },
        inlineEdit: {
          fields: ["composition", "weight", "pieces", "price", "isAvailable"],
        },
        linkToItem: true,
      },
    }),
    name: text({ validation: { isRequired: true }, label: "Название" }),
    description: text({ validation: { isRequired: true }, label: "описание" }),
    carbonhydrate: decimal({
      precision: 5,
      scale: 2,
      label: "углеводы",
    }),
    calories: decimal({
      precision: 5,
      scale: 2,
      label: "калории",
    }),
    protein: decimal({
      precision: 5,
      scale: 2,
      label: "белки",
    }),
    fat: decimal({ precision: 5, scale: 2, label: "жиры" }),
    ingredients: text({
      validation: { isRequired: true },
      label: "ингредиенты",
    }),
    lifeShelf: integer({
      validation: { isRequired: true },
      label: "срок хранения",
    }),
    image_icon: image({ storage: "yc_s3_image", label: "Иконка" }),
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
        const productFilling = await context.query.ProductFilling.findOne({
          where: { id: item.id.toString() },
          query: "id variants { id }",
        });
        await context.query.ProductVariant.deleteMany({
          where: productFilling.variants.map((v: { id: any }) => ({
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
