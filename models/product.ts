import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  checkbox,
  select,
  timestamp,
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
    categories: relationship({
      ref: "Category.products",
      many: true,
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

    name: text({
      validation: { isRequired: true },
      label: "Название десерта",
    }),

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
      label: "Выберите тип десерта",
      options: [
        {
          label: "Торт",
          value: "cake",
        },
        {
          label: "Пирожные",
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
          label: "Штук",
          value: "pieces",
        },
        {
          label: "Размер",
          value: "size",
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
        displayMode: "select",
      },
    }),

    mixBoxProduct: relationship({
      ref: "MixBoxProduct.product",
      many: false,
      label: "Выберите продукт для миксбокса",
      ui: {
        displayMode: "cards",
        cardFields: ["compositions"],
        inlineCreate: { fields: ["compositions"] },
        inlineEdit: { fields: ["compositions"] },
        linkToItem: true,
      },
    }),

    isAvailable: checkbox({ defaultValue: true, label: "Доступен" }),

    badge: select({
      options: [
        { label: "Новинка", value: "NEW" },
        { label: "Хит", value: "HIT" },
        { label: "Лидер продаж", value: "BEST_SELLER" },
        { label: "Скидка", value: "SALE" },
      ],
      defaultValue: undefined,
      label: "Значок",
    }),

    images: relationship({
      ref: "ProductImage.product",
      many: true,
      label: "Изображения(максимум 4)",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText", "isMain"],
        inlineCreate: {
          fields: ["image", "altText", "isMain"],
        },
        inlineEdit: {
          fields: ["image", "altText", "isMain"],
        },
        linkToItem: true,
      },
    }),

    video: relationship({
      ref: "ProductVideo.product",
      label: "Видео(максимум 15 секунд)",
      many: false,
      ui: {
        displayMode: "cards",
        cardFields: ["video"],
        inlineCreate: {
          fields: ["video"],
        },
        inlineEdit: {
          fields: ["video"],
        },
        linkToItem: true,
      },
    }),

    customizations: relationship({
      ref: "CustomizationOption.product",
      many: true,
      label: "Кастомизация Вариант",
    }),

    topping: relationship({
      ref: "Topping.products",
      label: "топпинг",
      many: false,
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
          query: "id images { id } video { id }",
        });

        await context.db.ProductImage.deleteMany({
          where: product.images.map((v: { id: any }) => ({ id: v.id })),
        });

        if (product.video) {
          await context.db.ProductVideo.deleteOne({
            where: { id: product.video.id },
          });
        }
      },
    },
  },
});
