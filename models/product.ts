import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  checkbox,
  integer,
  select,
  timestamp,
  decimal,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { getTransliterationSlug } from "../lib/getTransliteration";

export const Product = list({
  access: allowAll,
  fields: {
    category: relationship({
      ref: "Category.products",
      many: false,
    }),
    name: text({ validation: { isRequired: true } }),
    slug: text({
      isIndexed: "unique",
      ui: {
        createView: { fieldMode: "hidden" },
      },
    }),
    description: text({ validation: { isRequired: true } }),
    weight: decimal({
      precision: 3,
      scale: 1,
    }),
    price: decimal({
      precision: 10,
      scale: 2,
      validation: { isRequired: true },
    }),
    images: relationship({
      ref: "ProductImage",
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
    }),
    isAvailable: checkbox({ defaultValue: true }),
    stockQuantity: integer({ validation: { isRequired: true } }),
    lifeShelf: integer({ validation: { isRequired: true } }),
    ingredients: text({ validation: { isRequired: true } }),
    badge: select({
      options: [
        { label: "New", value: "new" },
        { label: "Hit", value: "hit" },
        { label: "Best Seller", value: "best_seller" },
        { label: "Sale", value: "sale" },
      ],
      defaultValue: undefined,
      label: "Badge",
    }),
    isFeatured: checkbox({ defaultValue: false }),
    heroLabel: text(),
    variants: relationship({
      ref: "ProductVariant.product",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["weight", "price", "stockQuantity", "isAvailable"],
        inlineCreate: {
          fields: ["weight", "price", "stockQuantity", "isAvailable"],
        },
        inlineEdit: {
          fields: ["weight", "price", "stockQuantity", "isAvailable"],
        },
        linkToItem: true,
      },
    }),
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
    resolveInput({ operation, resolvedData }) {
      if (operation === "create") {
        const { name } = resolvedData;
        if (name) {
          return {
            ...resolvedData,
            slug: getTransliterationSlug(name),
          };
        }
      }
      return resolvedData;
    },
    beforeOperation: {
      delete: async ({ context, item }) => {
        const product = await context.query.Product.findOne({
          where: { id: item.id.toString() },
          query: "id variants { id } images { id }",
        });
        await context.query.ProductVariant.deleteMany({
          where: product.variants.map((v: { id: any }) => ({ id: v.id })),
        });
        await context.query.ProductImage.deleteMany({
          where: product.images.map((v: { id: any }) => ({ id: v.id })),
        });
      },
    },
  },
});
