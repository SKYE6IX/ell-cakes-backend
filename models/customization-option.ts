import { list } from "@keystone-6/core";
import { timestamp, relationship, select, text } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const CustomizationOption = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },

  fields: {
    product: relationship({
      ref: "Product.customizations",
      many: true,
      ui: {
        createView: {
          fieldMode: "hidden",
        },
      },
    }),

    name: select({
      options: [
        { label: "Candle", value: "CANDLE" },
        { label: "Inscription", value: "INSCRIPTION" },
        { label: "Photos", value: "PHOTOS" },
      ],
      defaultValue: undefined,
      label: "Название",
    }),

    slug: text({
      hooks: {
        resolveInput: ({ resolvedData, fieldKey, operation }) => {
          if (operation === "create") {
            const { name } = resolvedData;
            resolvedData.slug = name.toLowerCase();
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

    customValues: relationship({
      ref: "CustomizationOptionValue.option",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["value", "extraPrice"],

        inlineCreate: {
          fields: ["value", "extraPrice"],
        },

        inlineEdit: {
          fields: ["value", "extraPrice"],
        },

        linkToItem: true,
      },

      label: "Указать значение",
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
  ui: {
    isHidden: !permissions.canManageAll,
  },

  hooks: {
    beforeOperation: {
      delete: async ({ context, item }) => {
        const customOption = await context.query.CustomizationOption.findOne({
          where: { id: item.id.toString() },
          query: "id customValues { id }",
        });

        await context.query.CustomizationOptionValue.deleteMany({
          where: customOption.customValues.map((v: { id: any }) => ({
            id: v.id,
          })),
        });
      },
    },
  },
});
