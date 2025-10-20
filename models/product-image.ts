import { list } from "@keystone-6/core";
import { text, image, relationship } from "@keystone-6/core/fields";
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
  },
  ui: {
    isHidden: true,
  },
});
