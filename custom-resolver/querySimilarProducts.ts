import { Context } from ".keystone/types";

export const querySimilarProducts = async (
  root: any,
  { productSlug }: { productSlug: string },
  context: Context
) => {
  const product = await context.db.Product.findOne({
    where: { slug: productSlug },
  });

  if (!product) {
    throw new Error("Unable to find product with this slug", {
      cause: "Invalid Args",
    });
  }

  return await context.db.Product.findMany({
    where: {
      variantType: { equals: product.variantType },
      NOT: { id: { equals: product.id } },
    },
    take: 4,
  });
};
