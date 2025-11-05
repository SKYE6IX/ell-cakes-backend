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
    attribute: relationship({
      ref: "Attribute.productFilling",
      ui: {
        displayMode: "cards",
        cardFields: ["name", "productAttributes"],
        inlineCreate: {
          fields: ["name", "productAttributes"],
        },
        inlineEdit: {
          fields: ["name", "productAttributes"],
        },
        linkToItem: true,
      },
    }),
    variants: relationship({
      label: "Вариант продукта",
      ref: "ProductVariant.filling",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["weight", "pieces", "price", "isAvailable"],
        inlineCreate: {
          fields: ["weight", "pieces", "price", "isAvailable"],
        },
        inlineEdit: {
          fields: ["weight", "pieces", "price", "isAvailable"],
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
        const productFilling = await context.query.ProductFilling.findOne({
          where: { id: item.id.toString() },
          query: "id variants { id } attribute { id }",
        });
        await context.query.ProductVariant.deleteMany({
          where: productFilling.variants.map((v: { id: string }) => ({
            id: v.id,
          })),
        });
        await context.query.Attribute.deleteOne({
          where: { id: productFilling.attribute.id },
        });
      },
    },
  },
  ui: {
    isHidden: true,
  },
});
