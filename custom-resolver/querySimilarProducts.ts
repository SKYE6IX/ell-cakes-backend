import { Context } from ".keystone/types";

export const querySimilarProducts = async (
  root: any,
  { productId, variantType }: { productId: string; variantType: string },
  context: Context
) => {
  return await context.db.Product.findMany({
    where: {
      variantType: { equals: variantType },
      NOT: { id: { equals: productId } },
    },
    take: 4,
  });
};
