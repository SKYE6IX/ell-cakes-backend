import { getContext } from "@keystone-6/core/context";
import * as PrismaModule from ".prisma/client";
import config from "../keystone";

async function main() {
  const context = getContext(config, PrismaModule);

  console.log("(update.ts)", "connect");

  await config.db.onConnect?.(context);

  const sudoContext = context.sudo();

  console.log(`🌱 Start updating data...`);

  const cakeSlug = "torty";

  const CAKE_PREPARATION_DAYS = 3;

  const OTHER_PREPARATION_DAYS = 2;

  const cakeProducts = await sudoContext.db.Product.findMany({
    where: {
      categories: {
        some: {
          parent: {
            slug: {
              equals: cakeSlug,
            },
          },
        },
      },
    },
  });

  const otherProducts = await sudoContext.db.Product.findMany({
    where: {
      categories: {
        none: {
          parent: {
            slug: {
              equals: cakeSlug,
            },
          },
        },
      },
    },
  });

  try {
    const updateCakesProducts = await sudoContext.db.Product.updateMany({
      data: cakeProducts.map((product) => ({
        where: { id: product.id },
        data: {
          preparationDays: CAKE_PREPARATION_DAYS,
        },
      })),
    });
    if (updateCakesProducts) {
      console.log("Update Cakes Data...✅");
    }
  } catch (error) {
    console.log("An error occur when try to update cakes❌ -> ", error);
  }

  try {
    const updateOtherCakesProducts = await sudoContext.db.Product.updateMany({
      data: otherProducts.map((product) => ({
        where: { id: product.id },
        data: {
          preparationDays: OTHER_PREPARATION_DAYS,
        },
      })),
    });

    if (updateOtherCakesProducts) {
      console.log("Update other cakes Data...✅");
    }
  } catch (error) {
    console.log("An error occur when try to update other cakes❌ -> ", error);
  }

  process.exit();
}

main();
