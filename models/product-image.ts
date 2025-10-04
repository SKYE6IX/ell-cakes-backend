import { list } from "@keystone-6/core";
import { text, image } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const ProductImage = list({
  access: allowAll,
  fields: {
    image: image({ storage: "yc_s3_image" }),
    altText: text(),
  },
  ui: {
    isHidden: true,
  },
});
