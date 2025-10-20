import { list } from "@keystone-6/core";
import { text, relationship, timestamp } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { getTransliterationSlug } from "../lib/getTransliteration";

export const Topping = list({
  access: allowAll,
  fields: {
    product: relationship({ ref: "Product.topping", many: false }),
    name: text({ isIndexed: "unique", validation: { isRequired: true } }),
    slug: text({
      hooks: {
        resolveInput: ({ resolvedData, operation, fieldKey }) => {
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
    options: relationship({
      ref: "ToppingOption.topping",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["weight", "pieces", "extraPrice"],
        inlineCreate: {
          fields: ["weight", "pieces", "extraPrice"],
        },
        inlineEdit: {
          fields: ["weight", "pieces", "extraPrice"],
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
    beforeOperation: {
      delete: async ({ context, item }) => {
        const topping = await context.query.Topping.findOne({
          where: { id: item.id.toString() },
          query: "id options { id }",
        });
        await context.query.ToppingOption.deleteMany({
          where: topping.options.map((v: { id: any }) => ({ id: v.id })),
        });
      },
    },
  },
});
