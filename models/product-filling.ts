import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  timestamp,
  decimal,
  image,
  checkbox,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";
import { getTransliterationSlug } from "../lib/getTransliteration";

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
    products: relationship({ ref: "Product.fillings", many: true }),

    name: text({ validation: { isRequired: true }, label: "Название" }),

    slug: text({
      hooks: {
        resolveInput: ({ resolvedData, fieldKey, operation }) => {
          if (operation === "create") {
            const { name } = resolvedData;
            resolvedData.slug = getTransliterationSlug(name);
            return resolvedData[fieldKey];
          }
          return resolvedData[fieldKey];
        },
      },
      isIndexed: "unique",
      ui: {
        itemView: {
          fieldMode: "read",
        },
        createView: { fieldMode: "hidden" },
      },
    }),

    hasDetails: checkbox({ defaultValue: true, label: "Имеет детали" }),

    description: text({ label: "Описание" }),

    carbonhydrate: decimal({
      precision: 5,
      scale: 2,
      label: "Углеводы",
    }),

    calories: decimal({
      precision: 5,
      scale: 2,
      label: "Калории",
    }),

    protein: decimal({
      precision: 5,
      scale: 2,
      label: "Белки",
    }),

    fat: decimal({ precision: 5, scale: 2, label: "Жиры" }),

    ingredients: text({
      label: "Ингредиенты",
    }),

    image_icon: image({ storage: "yc_s3_image", label: "Иконка" }),

    variants: relationship({
      label: "Вариант продукта",
      ref: "ProductVariant.filling",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["weight", "pieces", "size", "serving", "price"],
        inlineCreate: {
          fields: ["weight", "pieces", "size", "serving", "price"],
        },
        inlineEdit: {
          fields: ["weight", "pieces", "size", "serving", "price"],
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
          query: "id variants { id } ",
        });
        if (productFilling.variants) {
          await context.query.ProductVariant.deleteMany({
            where: productFilling.variants.map((v: { id: string }) => ({
              id: v.id,
            })),
          });
        }
        if (productFilling.attribute) {
          await context.query.Attribute.deleteOne({
            where: { id: productFilling.attribute.id },
          });
        }
      },
    },
  },
  ui: {
    isHidden: true,
  },
});
