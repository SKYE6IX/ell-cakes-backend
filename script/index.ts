// @ts-expect-error Upload.mjs was exported from the type
import Upload from "graphql-upload/Upload.js";
import { getContext } from "@keystone-6/core/context";
import * as PrismaModule from ".prisma/client";
import path from "path";
import sharp from "sharp";
import { promisify } from "node:util";
import heicConvert from "heic-convert";
import { Readable } from "stream";
import { createReadStream, readdirSync, readFileSync, readFile } from "node:fs";
import { getTransliterationSlug } from "../lib/getTransliteration";
import { fileTypeFromStream } from "file-type";
import config from "../keystone";

async function main() {
  const context = getContext(config, PrismaModule);

  console.log("(index.ts)", "connect");

  await config.db.onConnect?.(context);

  const sudoContext = context.sudo();

  console.log(`🌱 Inserting Seed Data`);

  const categoriesPath = path.join(process.cwd(), "data", "categories.json");
  const categories = JSON.parse(readFileSync(categoriesPath, "utf-8"));

  const productsFolderPath = path.join(process.cwd(), "data", "products");
  const productsFiles = readdirSync(productsFolderPath);

  // Seeding categories if they don't exist
  console.log("🌱 Seeding categories...");

  const existingDbCategories = await sudoContext.db.Category.findMany();

  // Top Level Categories
  const topLevelCategories = [];
  for (const category of categories) {
    const slug = getTransliterationSlug(category.name);
    const existingCategory = existingDbCategories.find(
      (cat) => cat.slug === slug
    );
    if (existingCategory) {
      console.log("Category already exist: ->", category.name);
      topLevelCategories.push({ ...category, id: existingCategory.id });
      continue;
    }
    const newCategory = await sudoContext.db.Category.createOne({
      data: { name: category.name },
    });
    topLevelCategories.push({ ...category, id: newCategory.id });
  }

  // Second Level Categories
  // We used "Find" since at the moment
  // we only have one category with sub-categories
  const categoryWithSubCategories = topLevelCategories.find(
    (cat) => cat.subcategories.length > 0
  );

  for (const subCategory of categoryWithSubCategories.subcategories) {
    const slug = getTransliterationSlug(subCategory.name);
    const existingSubCategory = existingDbCategories.find(
      (cat) => cat.slug === slug
    );
    if (existingSubCategory) {
      console.log("Category already exist: ->", subCategory.name);
      continue;
    }
    await sudoContext.db.Category.createOne({
      data: {
        name: subCategory.name,
        parent: { connect: { id: categoryWithSubCategories.id } },
      },
    });
  }

  console.log("✅ Category seeded OR existed");

  // Query all the categories
  const dbCategories = await sudoContext.db.Category.findMany();

  // Query all the product fillings
  const dbProductFillings = await sudoContext.db.ProductFilling.findMany();

  const productFillingMap = new Map();
  for (const productFilling of dbProductFillings) {
    productFillingMap.set(productFilling.slug, productFilling);
  }

  // Query all the product
  const existingProducts = await sudoContext.db.Product.findMany();

  console.log("🌱 Seeding products...");

  for (const productFile of productsFiles) {
    const productPath = path.join(productsFolderPath, productFile);

    const product = JSON.parse(readFileSync(productPath, "utf-8"));

    const connectProductFillingIds = [];

    for (const productFilling of product.fillings) {
      const productFillingSlug = getTransliterationSlug(productFilling.name);

      // We check if a filling already exist or has been created by the previous
      // product so we can re-use it by storing it's ID into an array
      const existingProductFilling = productFillingMap.get(productFillingSlug);

      if (existingProductFilling) {
        console.log(
          "This product filling has been created and can be reused! -> ",
          existingProductFilling.name
        );
        connectProductFillingIds.push({ id: existingProductFilling.id });
      } else {
        // If the filling doesn't exisit, we can go on and create a new one and then return
        // it's ID, NAME, and SLUG for later used.
        const newProductFilling = await sudoContext.db.ProductFilling.createOne(
          {
            data: {
              ...productFilling,
              variants: {
                create: productFilling.variants.map((variant: any) => ({
                  ...variant,
                })),
              },
            },
          }
        );

        // First add to the "existingProductFillings" Array
        productFillingMap.set(newProductFilling.slug, newProductFilling);

        // And then assign a local ID for connection for each product
        // because we need to know which product has particular fillings
        connectProductFillingIds.push({ id: newProductFilling.id });
      }
    }

    // Check if the product exist and skip the product
    const productSlug = getTransliterationSlug(product.name);

    const existingProduct = existingProducts.find(
      (ep) => ep.slug === productSlug
    );

    if (existingProduct) {
      console.log(`${product.name} already existed...`);
      continue;
    }

    // If product doesn't exist, we start the creation of a new product.
    const productCategories = product.categories.map((productCat: string) => {
      const category = dbCategories.find(
        (cat) => cat.slug === getTransliterationSlug(productCat)
      );
      return category;
    });

    // If product has a topping among it's data
    let toppingId = null;
    if (product.topping) {
      const toppingSlug = getTransliterationSlug(product.topping.toppingName);

      // Query all the toppings
      const dbToppings = await sudoContext.db.Topping.findMany();

      // First check if the topping exist
      const existingTopping = dbToppings.find((tp) => tp.slug === toppingSlug);

      if (existingTopping) {
        console.log("Toppig already exist...");
        toppingId = existingTopping.id;
      } else {
        console.log("Creating a new topping...");
        const topping = await sudoContext.db.Topping.createOne({
          data: {
            name: product.topping.toppingName,
            options: {
              create: product.topping.options.map((option: any) => ({
                ...option,
              })),
            },
          },
        });
        toppingId = topping.id;
      }
    }

    // We check for if a product has a customization
    let customizationsId: string[] = [];
    if (product.customizations) {
      const dbCusomizations =
        await sudoContext.db.CustomizationOption.findMany();

      product.customizations.forEach(async (productCus: any) => {
        const existingCustomization = dbCusomizations.find(
          (cus) => cus.slug === productCus.customizationName.toLowerCase()
        );

        if (existingCustomization) {
          console.log("Customization already exist...");
          customizationsId.push(existingCustomization.id);
        } else {
          console.log("Creating a new customization...");
          const newCustomization =
            await sudoContext.db.CustomizationOption.createOne({
              data: {
                name: productCus.customizationName.toUpperCase(),
                customValues: {
                  create: productCus.valueOptions.map((val: any) => ({
                    ...val,
                  })),
                },
              },
            });
          customizationsId.push(newCustomization.id);
        }
      });
    }

    console.log("Creating new product....");
    const newProduct = await context.prisma.product.create({
      data: {
        name: product.name,
        slug: productSlug,
        baseDescription: product.baseDescription,
        type: product.type,
        variantType: product.variantType,
        fillings: {
          connect: connectProductFillingIds.map((cpf) => ({ ...cpf })),
        },
        categories: {
          connect: productCategories.map((c: { id: any }) => ({ id: c?.id })),
        },
        ...(product.customizations && {
          customizations: {
            connect: customizationsId.map((cusId: string) => ({ id: cusId })),
          },
        }),
        ...(product.topping && {
          topping: { connect: { id: toppingId } },
        }),
      },
    });

    console.log("Newly created product: -> ", newProduct.id);

    console.log("🎆 Starting images uploading....");

    const imagesFolder = path.join(
      process.cwd(),
      "data",
      "products-media",
      product.imagesFolder,
      "images"
    );
    const imageFiles = readdirSync(imagesFolder);

    for (const fileName of imageFiles) {
      const imagePath = path.join(imagesFolder, fileName);
      const imageData = await getImageData(imagePath, fileName);
      const upload = new Upload();
      upload.resolve(imageData);
      await sudoContext.query.ProductImage.createOne({
        data: {
          image: { upload: upload },
          product: { connect: { id: newProduct?.id } },
        },
      });
    }

    console.log("🎆 Added images. Total: -> ", imageFiles.length);

    console.log("🎆 Starting video uploading....");
    const videoFolder = path.join(
      process.cwd(),
      "data",
      "products-media",
      product.imagesFolder,
      "video"
    );

    const videoFile = readdirSync(videoFolder)[0];

    if (videoFile) {
      const videoPath = path.join(videoFolder, videoFile);
      const stream = createReadStream(videoPath);
      const type = await fileTypeFromStream(stream);

      const videoData = {
        createReadStream: () => createReadStream(videoPath),
        filename: videoFile,
        mimetype: type?.mime,
        encoding: "7bit",
      };

      const upload = new Upload();
      upload.resolve(videoData);

      await sudoContext.db.ProductVideo.createOne({
        data: {
          video: { upload: upload },
          product: { connect: { id: newProduct?.id } },
        },
      });
      console.log("🎆 Added a video.... Name: -> ", videoFile);
    }
  }

  console.log("✅ Product seeded OR existed");

  console.log(`✅ Seed Data Inserted`);
  process.exit();
}
main();

async function getImageData(imagePath: string, fileName: string) {
  const mimeType = (await sharp(imagePath).metadata()).format;
  if (mimeType === "heif") {
    const inputBuffer = await promisify(readFile)(imagePath);

    const convertedFile = await heicConvert({
      buffer: inputBuffer as unknown as ArrayBufferLike,
      format: "JPEG",
      quality: 0.85,
    });

    const convertedBuffer = Buffer.from(convertedFile);

    return {
      createReadStream: () => Readable.from(convertedBuffer),
      filename: fileName,
      mimetype: `image/jpeg`,
      encoding: "7bit",
    };
  } else {
    return {
      createReadStream: () => createReadStream(imagePath),
      filename: fileName,
      mimetype: `image/${mimeType}`,
      encoding: "7bit",
    };
  }
}
