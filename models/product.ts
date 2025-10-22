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
    }),
    name: text({ validation: { isRequired: true } }),
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
        createView: { fieldMode: "hidden" },
      },
    }),
    description: text({ validation: { isRequired: true } }),
    basePrice: integer({ validation: { isRequired: true } }),
    baseWeight: decimal({
      precision: 4,
      scale: 1,
      defaultValue: undefined,
    }),
    basePieces: integer({ defaultValue: undefined }),
    carbonhydrate: decimal({
      precision: 5,
      scale: 2,
    }),
    calories: decimal({
      precision: 5,
      scale: 2,
    }),
    protein: decimal({
      precision: 5,
      scale: 2,
    }),
    fat: decimal({ precision: 5, scale: 2 }),
    lifeShelf: integer({ validation: { isRequired: true } }),
    ingredients: text({ validation: { isRequired: true } }),
    stockQuantity: integer({ validation: { isRequired: true } }),
    isAvailable: checkbox({ defaultValue: true }),
    badge: select({
      options: [
        { label: "New", value: "NEW" },
        { label: "Hit", value: "HIT" },
        { label: "Best Seller", value: "BEST_SELLER" },
        { label: "Sale", value: "SALE" },
      ],
      defaultValue: undefined,
      label: "Badge",
    }),
    isFeatured: checkbox({ defaultValue: false }),
    isHomeHero: checkbox({ defaultValue: false }),
    homeHeroText: text({ defaultValue: undefined }),
    isCategoryHero: checkbox({ defaultValue: false }),
    categoryHeroText: text({ defaultValue: undefined }),
    images: relationship({
      ref: "ProductImage.product",
      many: true,
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
    video: file({ storage: "yc_s3_files" }),
    variants: relationship({
      ref: "ProductVariant.product",
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
    customization: relationship({
      ref: "ProductCustomization.product",
      many: false,
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
    }),
    cartItems: relationship({ ref: "CartItem.product", many: true }),
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
