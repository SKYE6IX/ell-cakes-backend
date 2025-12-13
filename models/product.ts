import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  checkbox,
  integer,
  select,
  timestamp,
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
    baseDescription: text({
      validation: { isRequired: true },
      label: "Базовое описание",
    }),
    type: select({
      label: "Выберите тип торта",
      options: [
        {
          label: "Торт",
          value: "cake",
        },
        {
          label: "Капкейки",
          value: "cupcake",
        },
        {
          label: "Капкейки Микс",
          value: "mixed_box",
        },
      ],
      validation: { isRequired: true },
      ui: {
        displayMode: "segmented-control",
      },
    }),
    variantType: select({
      label: "Выберите тип варианта",
      options: [
        {
          label: "Вес",
          value: "weight",
        },
        {
          label: "Количество",
          value: "pieces",
        },
      ],
      validation: { isRequired: true },
      ui: {
        displayMode: "segmented-control",
      },
    }),
    fillings: relationship({
      label: "Начинки",
      ref: "ProductFilling.products",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: [
          "name",
          "description",
          "carbonhydrate",
          "calories",
          "protein",
          "fat",
          "ingredients",
          "lifeShelf",
          "image_icon",
          "variants",
        ],
        inlineCreate: {
          fields: [
            "name",
            "description",
            "carbonhydrate",
            "calories",
            "protein",
            "fat",
            "ingredients",
            "lifeShelf",
            "image_icon",
            "variants",
          ],
        },
        inlineEdit: {
          fields: [
            "name",
            "description",
            "carbonhydrate",
            "calories",
            "protein",
            "fat",
            "ingredients",
            "lifeShelf",
            "image_icon",
            "variants",
          ],
        },
        linkToItem: true,
      },
    }),
    mixBoxCompositions: relationship({
      ref: "Product",
      many: true,
      label: "Выберите продукт для миксбокса",
    }),
    stockQuantity: integer({
      label: "количество на складе",
      validation: { isRequired: true },
    }),
    isAvailable: checkbox({ defaultValue: true, label: "в наличии" }),
    badge: select({
      options: [
        { label: "Новинка", value: "NEW" },
        { label: "Хит", value: "HIT" },
        { label: "Лидер продаж", value: "BEST_SELLER" },
        { label: "Скидка", value: "SALE" },
      ],
      defaultValue: undefined,
      label: "значок",
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
    }),
    video: file({ storage: "yc_s3_files", label: "видео" }),
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
          query: "id images { id } customization { id } fillings { id }",
        });
        await context.query.ProductImage.deleteMany({
          where: product.images.map((v: { id: any }) => ({ id: v.id })),
        });
        if (product.customization) {
          await context.query.ProductCustomization.deleteOne({
            where: { id: product.customization.id },
          });
        }
      },
    },
  },
});
