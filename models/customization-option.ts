import { list } from "@keystone-6/core";
import { text, timestamp, relationship, select } from "@keystone-6/core/fields";
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
    name: select({
      options: [
        { label: "Color", value: "COLOR" },
        { label: "Shape", value: "SHAPE" },
        { label: "Inscription", value: "INSCRIPTION" },
        { label: "Photos", value: "PHOTOS" },
      ],
      defaultValue: undefined,
      label: "Product Customization",
      isIndexed: "unique",
    }),
    slug: text({
      isIndexed: "unique",
      hooks: {
        resolveInput: ({ resolvedData, operation, fieldKey }) => {
          if (operation === "create") {
            const { name } = resolvedData;
            resolvedData.slug = name
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/['"]/g, "");
            return resolvedData[fieldKey];
          }
          return resolvedData[fieldKey];
        },
      },
      ui: {
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
  ui: {
    isHidden: true,
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
