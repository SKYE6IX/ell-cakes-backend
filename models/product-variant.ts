import { list } from "@keystone-6/core";
import {
  relationship,
  checkbox,
  integer,
  timestamp,
  decimal,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const ProductVariant = list({
  access: allowAll,
  fields: {
    product: relationship({ ref: "Product.variants", many: false }),
    weight: decimal({
      precision: 3,
      scale: 1,
      validation: { isRequired: true },
    }),
    price: decimal({
      precision: 10,
      scale: 2,
      validation: { isRequired: true },
    }),
    stockQuantity: integer({
      defaultValue: 0,
      validation: { isRequired: true },
    }),
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
