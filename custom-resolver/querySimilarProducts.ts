import { Context } from ".keystone/types";

export const querySimilarProducts = async (
  root: any,
  { productId, categoryId }: { productId: string; categoryId: string },
  context: Context
) => {
  // return await context.db.Product.findMany({
  //   where: {
  //     category: { id: { equals: categoryId } },
  //     NOT: { id: { equals: productId } },
  //   },
  //   take: 4,
  // });
};
