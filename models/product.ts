import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  checkbox,
  integer,
  select,
  timestamp,
  decimal,
  file,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { getTransliterationSlug } from "../lib/getTransliteration";
import { permissions } from "../access";

export const Product = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    category: relationship({
      ref: "Category.products",
      many: false,
      hooks: {
        validate: {
          create: async ({ resolvedData, fieldKey, addValidationError }) => {
            if (!resolvedData[fieldKey] || !resolvedData[fieldKey].connect) {
              addValidationError(
                `The ${fieldKey} field must be set to a valid Category.`
              );
            }
          },
        },
      },
      label: "Категория",
    }),
    name: text({ validation: { isRequired: true }, label: "Название торта" }),
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
    description: text({ validation: { isRequired: true }, label: "описание" }),
    basePrice: integer({
      validation: { isRequired: true },
      label: "базовая цена",
    }),
    baseWeight: decimal({
      precision: 4,
      scale: 1,
      defaultValue: undefined,
      label: "базовый вес",
    }),
    basePieces: integer({
      defaultValue: undefined,
      label: "количество порций",
    }),
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
    lifeShelf: integer({
      validation: { isRequired: true },
      label: "срок хранения",
    }),
    ingredients: text({
      validation: { isRequired: true },
      label: "ингредиенты",
    }),
    stockQuantity: integer({
      validation: { isRequired: true },
      label: "количество на складе",
    }),
    isAvailable: checkbox({ defaultValue: true, label: "в наличии" }),
    badge: select({
      options: [
        { label: "New", value: "NEW" },
        { label: "Hit", value: "HIT" },
        { label: "Best Seller", value: "BEST_SELLER" },
        { label: "Sale", value: "SALE" },
      ],
      defaultValue: undefined,
      label: "значок",
    }),
    isFeatured: checkbox({ defaultValue: false, label: "популярный товар" }),
    isHomeHero: checkbox({ defaultValue: false, label: "на главной странице" }),
    homeHeroText: text({
      defaultValue: undefined,
      label: "текст на главной странице",
    }),
    isCategoryHero: checkbox({
      defaultValue: false,
      label: "в категории на баннере",
    }),
    categoryHeroText: text({
      defaultValue: undefined,
      label: "текст баннера категории",
    }),
    images: relationship({
      ref: "ProductImage.product",
      many: true,
      label: "изображения",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: {
          fields: ["image", "altText"],
        },
        inlineEdit: {
          fields: ["image", "altText"],
        },
        linkToItem: true,
      },
      hooks: {
        validate: {
          create: async ({ resolvedData, fieldKey, addValidationError }) => {
            if (!resolvedData[fieldKey] || !resolvedData[fieldKey].connect) {
              addValidationError(
                `The ${fieldKey} field must be set to valid Images.`
              );
            }
          },
        },
      },
    }),
    video: file({ storage: "yc_s3_files", label: "видео" }),
    variants: relationship({
      ref: "ProductVariant.product",
      many: true,
      label: "варианты",
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
    customization: relationship({
      ref: "ProductCustomization.product",
      many: false,
      label: "персонализация",
      ui: {
        displayMode: "cards",
        cardFields: ["customOptions"],
        inlineCreate: {
          fields: ["customOptions"],
        },
        inlineEdit: {
          fields: ["customOptions"],
        },
        linkToItem: true,
      },
    }),
    topping: relationship({
      ref: "Topping.product",
      label: "топпинг",
    }),
    cartItems: relationship({
      ref: "CartItem.product",
      many: true,
      ui: {
        itemView: {
          fieldMode: "hidden",
        },
        createView: { fieldMode: "hidden" },
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
        const product = await context.query.Product.findOne({
          where: { id: item.id.toString() },
          query: "id variants { id } images { id } customization { id }",
        });
        await context.query.ProductImage.deleteMany({
          where: product.images.map((v: { id: any }) => ({ id: v.id })),
        });
        if (!!product.variants.length) {
          await context.query.ProductVariant.deleteMany({
            where: product.variants.map((v: { id: any }) => ({ id: v.id })),
          });
        }
        if (!!product.customization) {
          await context.query.ProductCustomization.deleteOne({
            where: { id: product.customization.id },
          });
        }
      },
    },
  },
});
