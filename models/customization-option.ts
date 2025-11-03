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
    productCustomization: relationship({
      ref: "ProductCustomization.customOptions",
    }),
    name: select({
      options: [
        { label: "Color", value: "COLOR" },
        { label: "Candle", value: "CANDLE" },
        { label: "Shape", value: "SHAPE" },
        { label: "Inscription", value: "INSCRIPTION" },
        { label: "Photos", value: "PHOTOS" },
      ],
      defaultValue: undefined,
      label: "Название",
    }),
    customValues: relationship({
      ref: "CustomizationOptionValue.option",
      many: true,
      ui: {
        displayMode: "cards",
        itemView: {
          fieldMode: "read",
        },
        cardFields: ["value", "extraPrice", "optionConstraint"],
        inlineCreate: {
          fields: ["value", "extraPrice", "optionConstraint"],
        },
        inlineEdit: {
          fields: ["value", "extraPrice", "optionConstraint"],
        },
        linkToItem: true,
      },
      label: "Варианты выбора",
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
