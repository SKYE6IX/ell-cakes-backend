import { list } from "@keystone-6/core";
import {
  text,
  image,
  relationship,
  timestamp,
  checkbox,
} from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../access";

export const ProductImage = list({
  access: {
    operation: {
      query: allowAll,
      create: permissions.canManageProduct,
      update: permissions.canManageProduct,
      delete: permissions.canManageProduct,
    },
  },
  fields: {
    product: relationship({ ref: "Product.images" }),

    image: image({ storage: "yc_s3_image" }),

    altText: text(),

    isMain: checkbox({ defaultValue: false, label: "Главная" }),

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
});
