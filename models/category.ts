import { list } from "@keystone-6/core";
import { text, relationship } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { getTransliterationSlug } from "../lib/getTransliteration";
import { permissions } from "../access";

export const Category = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: text({
      isIndexed: "unique",
      ui: {
        createView: { fieldMode: "hidden" },
      },
    }),
    parent: relationship({ ref: "Category", many: false }),
    products: relationship({ ref: "Product.category", many: true }),
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
  },
});
