import { list } from "@keystone-6/core";
import { text, checkbox, timestamp, decimal } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const Topping = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text(),
    price: decimal({ precision: 10, scale: 2 }),
    isAvailable: checkbox({ defaultValue: true }),
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
});
