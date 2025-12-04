import { Prisma } from "@prisma/client";
import { Context } from ".keystone/types";
import { getSessionCartId } from "../lib/getSessionCartId";
import type { Session } from "../access";

export interface CustomizationSnapshot {
  name: string;
  customValue: {
    value: string;
    extraPrice: number;
    inscriptionText: string | null;
    imagesId: string[] | null;
  };
}
interface CustomizationValue {
  optionId: string;
  valueId: string;
  inscriptionText: string | null;
  imagesId: string[] | null;
}
interface AddToCartArgs {
  productId: string;
  variantId: string;
  customizations: CustomizationValue[] | null;
  compositionOptions: { productId: string; quantity: number }[] | null;
  toppingOptionId: string | null;
}

type CartWithItem = Prisma.CartGetPayload<{
  select: {
    id: true;
    cartItems: {
      select: {
        id: true;
        quantity: true;
        unitPrice: true;
        subTotal: true;
        productId: true;
        variantId: true;
        toppingOptionId: true;
        compositionSnapShot: true;
        customizationsSnapShot: true;
      };
    };
  };
}>;

const selectItemInCart = {
  id: true,
  cartItems: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      subTotal: true,
      productId: true,
      variantId: true,
      toppingOptionId: true,
      compositionSnapShot: true,
      customizationsSnapShot: true,
    },
  },
};

export const addToCart = async (
  root: any,
  {
    productId,
    variantId,
    customizations,
    compositionOptions,
    toppingOptionId,
  }: AddToCartArgs,
  context: Context
) => {
  let cart: CartWithItem | null = null;
  const loggedInUser = context.session as Session;
  let sessionCartId = "";
  if (!sessionCartId) {
    sessionCartId = getSessionCartId(context);
  }

  const cartWhere = loggedInUser
    ? { userId: loggedInUser.itemId }
    : { sessionId: sessionCartId };

  cart = await context.prisma.cart.upsert({
    where: cartWhere,
    update: {},
    create: {
      sessionId: sessionCartId,
      ...(loggedInUser && { user: { connect: { id: loggedInUser.itemId } } }),
    },
    select: selectItemInCart,
  });

  const product = await context.prisma.product.findUnique({
    where: { id: productId },
    select: {
      fillings: {
        where: {
          variants: { some: { id: variantId } },
        },
        select: {
          variants: {
            where: { id: variantId },
            select: {
              id: true,
              weight: true,
              pieces: true,
              price: true,
            },
          },
        },
      },
      topping: {
        select: { options: { where: { id: toppingOptionId ?? "" } } },
      },
      customization: {
        select: {
          customOptions: {
            select: { id: true, name: true, customValues: true },
          },
        },
      },
    },
  });

  const customOptionsMap = new Map(
    product?.customization?.customOptions.map((option) => [
      option.id,
      option,
    ]) || []
  );

  // Check if user added customization and calculate the
  // one with extra price and return a snapShot of it.
  let customizationsTotalAmount = 0;
  let customizationsSnapShot = null;
  if (customizations) {
    customizationsSnapShot = customizations?.map((customization) => {
      const customOption = customOptionsMap.get(customization.optionId);

      const customValuesMap = new Map(
        customOption?.customValues.map((value) => [value.id, value]) || []
      );

      const valueOption = customValuesMap.get(customization.valueId);

      const extraPrice = valueOption?.extraPrice ?? 0;

      customizationsTotalAmount += extraPrice;
      return {
        name: customOption?.name || "",
        customValue: {
          value: valueOption?.value || "",
          extraPrice: valueOption?.extraPrice || 0,
          inscriptionText: customization.inscriptionText ?? null,
          imagesId: customization.imagesId ?? null,
        },
      };
    });
  }

  // Store the composition (Mix box cupcakes in context of this code)
  // snapShot for comprasion
  let compositionSnapShot = null;
  if (compositionOptions) {
    compositionOptions = compositionOptions?.map((composition) => {
      return {
        productId: composition.productId,
        quantity: composition.quantity,
      };
    });
  }

  // Check for existing cart-item
  const cartItemMap = new Map<string, CartWithItem["cartItems"][0]>();
  for (const cartItem of cart.cartItems) {
    cartItemMap.set(generateCartItemKey(cartItem), cartItem);
  }

  const key = generateCartItemKey({
    productId,
    variantId,
    toppingOptionId,
    compositionSnapShot,
    customizationsSnapShot,
  });

  const existCartItem = cartItemMap.get(key) ?? null;

  if (existCartItem) {
    const newQuantity = Number(existCartItem.quantity) + 1;
    await context.db.CartItem.updateOne({
      where: { id: existCartItem.id },
      data: {
        quantity: newQuantity,
        subTotal: Number(existCartItem.unitPrice) * newQuantity,
        updatedAt: new Date(),
      },
    });
  } else {
    const selectedTopping = product?.topping?.options[0];
    // Calculate the unit price for a single product
    const toppingPrice = selectedTopping?.extraPrice ?? 0;
    const basePrice = product?.fillings[0].variants[0].price ?? 0;
    const unitPrice = basePrice + customizationsTotalAmount + toppingPrice;
    await context.db.CartItem.createOne({
      data: {
        cart: { connect: { id: cart.id } },
        variant: { connect: { id: variantId } },
        product: { connect: { id: productId } },
        unitPrice: unitPrice,
        subTotal: unitPrice * 1,
        ...(compositionOptions && { compositionSnapShot: compositionSnapShot }),
        ...(customizations && {
          customizationsSnapShot: customizationsSnapShot,
        }),
        ...(toppingOptionId && {
          toppingOption: { connect: { id: selectedTopping?.id } },
        }),
      },
    });
  }

  // Calculate all cart-items
  const result = await context.prisma.cartItem.aggregate({
    _sum: {
      subTotal: true,
    },
    where: {
      cartId: cart.id,
    },
  });
  const newCartSubTotal = result._sum.subTotal || 0;

  return context.db.Cart.updateOne({
    where: { id: cart.id },
    data: {
      subTotal: newCartSubTotal,
      updatedAt: new Date(),
    },
  });
};

function generateCartItemKey(
  item: Omit<
    CartWithItem["cartItems"][0],
    "id" | "quantity" | "unitPrice" | "subTotal"
  >
) {
  return JSON.stringify({
    productId: item.productId,
    variantId: item.variantId,
    toppingOptionId: item.toppingOptionId ?? null,
    compositionSnapShot: item.compositionSnapShot?.toString(),
    customizationsSnapShot: item.customizationsSnapShot?.toString(),
  });
}
