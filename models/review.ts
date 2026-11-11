import { list } from "@keystone-6/core";
import { timestamp, text, image } from "@keystone-6/core/fields";
import { allOperations } from "@keystone-6/core/access";
import { isSignedIn as hasSession, permissions, rules } from "../access";

export const Review = list({
  access: {
    operation: {
      ...allOperations(hasSession),
    },
    filter: {
      query: rules.canReadOrder,
      update: permissions.canManageOrder,
      delete: permissions.canManageOrder,
    },
  },

  fields: {
    user: text({ validation: { isRequired: true }, label: "Имя" }),
    description: text({ validation: { isRequired: true }, label: "Описания" }),
    image: image({ storage: "yc_s3_review_images", label: "Изображения" }),
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
});
