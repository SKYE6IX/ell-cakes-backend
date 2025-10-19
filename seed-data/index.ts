import { getTransliterationSlug } from "../lib/getTransliteration";
import { categories } from "./data";
import type { Context } from ".keystone/types";

export async function insertSeedData(context: Context) {
  console.log(`🌱 Inserting Seed Data`);

  // const metaData = await context.query.ProductImage.createOne({
  //   data: {
  //     image: { upload: "" },
  //   },
  //   query: "id",
  // });
  await context.transaction(async (tx) => {
    //Process top-level categories
    const topLevelCategories = [];
    for (const category of categories) {
      const slug = getTransliterationSlug(category.name);
      const existingCategory = await tx.prisma.category.findUnique({
        where: { slug: slug },
      });

      //Check if category exist and return
      if (existingCategory) {
        topLevelCategories.push({ ...category, id: existingCategory.id });
        continue;
      }
      const newCategory = await context.prisma.category.create({
        data: {
          name: category.name,
          slug: getTransliterationSlug(category.name),
        },
      });
      topLevelCategories.push({ ...category, id: newCategory.id });
    }
    //Process subcategories
    const categoryWithSubCategories = topLevelCategories.find(
      (cat) => cat.subcategories.length > 0
    );
    if (categoryWithSubCategories) {
      for (const subCategory of categoryWithSubCategories.subcategories) {
        const slug = getTransliterationSlug(subCategory.name);
        const existingSubCategory = await tx.prisma.category.findUnique({
          where: { slug: slug },
        });
        if (existingSubCategory) {
          console.log("Category already exist: ", subCategory.name);
          continue;
        }

        //Check if category exist and return
        console.log("Creating category: ", subCategory.name);
        await context.prisma.category.create({
          data: {
            name: subCategory.name,
            slug: getTransliterationSlug(subCategory.name),
            parent: { connect: { id: categoryWithSubCategories.id } },
          },
        });
      }
    }
    console.log(`✅ Seed Data Inserted`);
    process.exit();
  });
}
