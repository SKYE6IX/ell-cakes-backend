import { Prisma } from "@prisma/client";
import { Context } from ".keystone/types";
import type { Session } from "../access";

interface AddToCartArgs {
  productId: string;
  variantId: string;
  customizations: { optionId: string; valueId: string }[] | null;
  compositionOptions: { productId: string; quantity: number }[] | null;
  toppingOptionId: string | null;
  cartId: string | null;
}
export type CartWithItem = Prisma.CartGetPayload<{
  include: { cartItems: true };
}>;

export type ProductVariant = Prisma.ProductVariantGetPayload<{
  include: {
    filling: {
      include: {
        products: {
          include: {
            customization: {
              include: { customOptions: { include: { customValues: true } } };
            };
            topping: { include: { options: true } };
          };
        };
      };
    };
  };
}>;

export const addToCart = async (
  root: any,
  {
    productId,
    variantId,
    customizations,
    compositionOptions,
    toppingOptionId,
    cartId,
  }: AddToCartArgs,
  context: Context
) => {
  let cart: CartWithItem | null = null;
  const loggedInUser = context.session as Session;

  // If user is in session, we try to find if they have an existing cart
  if (loggedInUser) {
    cart = await context.prisma.cart.findUnique({
      where: { userId: loggedInUser.itemId },
      include: { cartItems: true },
    });
    // If user isn't in session but they already create a cart, we get the cart by it's ID
  } else if (cartId) {
    cart = await context.prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: true },
    });
  }

  // At this stage if Cart is null, we create a new Cart
  if (cart === null) {
    cart = await context.prisma.cart.create({
      data: {
        ...(loggedInUser && { user: { connect: { id: loggedInUser.itemId } } }),
      },
      include: { cartItems: true },
    });
  }

  // Query the details about the product using the VariantID
  const productVariant = (await context.query.ProductVariant.findOne({
    where: { id: variantId },
    query: `
     id
     weight
     pieces
     price
     filling { 
      id
      name
      products {
       id
       name
       customization { id customOptions { id name customValues { id value extraPrice } } }
       topping { id options { id weight pieces extraPrice } }
      }
     }
    `,
  })) as ProductVariant;

  // We find the current product inside the filling using it's ID
  const product = productVariant.filling?.products.find(
    (product) => product.id === productId
  );

  // Check if user added customization and calculate the
  // one with extra price and return a snapShot of it.
  let customizationsTotalAmount = 0;
  let customizationSnapShot = null;
  if (customizations) {
    customizationSnapShot = customizations?.map((customization) => {
      const customOption = product?.customization?.customOptions.find(
        (option) => option.id === customization.optionId
      );
      const valueOption = customOption?.customValues.find(
        (value) => value.id === customization.valueId
      );
      const extraPrice = valueOption?.extraPrice ?? 0;
      customizationsTotalAmount += extraPrice;
      return {
        name: customOption?.name || "",
        customValue: {
          value: valueOption?.value || "",
          extraPrice: valueOption?.extraPrice || 0,
        },
      };
    });
  }

  // Store the composition snapShot for comprasion
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
  const existCartItem = cart.cartItems.find((item) => {
    const sameProduct = item.productId === productId;
    const sameVariant = item.variantId === variantId;
    const sameTopping = item.toppingOptionId === (toppingOptionId ?? null);
    const sameCompositionOptions =
      JSON.stringify(item.compositionSnapShot) ===
      JSON.stringify(compositionSnapShot);
    const sameCustomization =
      JSON.stringify(item.customizationSnapShot) ===
      JSON.stringify(customizationSnapShot);
    return (
      sameProduct &&
      sameVariant &&
      sameTopping &&
      sameCompositionOptions &&
      sameCustomization
    );
  });

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
    // Check if user select topping option and get the price
    const selectedTopping = product?.topping?.options.find(
      (toppingOption) => toppingOption.id === toppingOptionId
    );
    // Calculate the unit price for a single product
    const toppingPrice = selectedTopping?.extraPrice ?? 0;
    const basePrice = productVariant.price;
    const unitPrice = basePrice + customizationsTotalAmount + toppingPrice;
    await context.db.CartItem.createOne({
      data: {
        cart: { connect: { id: cart.id } },
        variant: { connect: { id: productVariant.id } },
        product: { connect: { id: product?.id } },
        unitPrice: unitPrice,
        subTotal: unitPrice * 1,
        ...(compositionOptions && { compositionSnapShot: compositionSnapShot }),
        ...(customizations && { customizationSnapShot: customizationSnapShot }),
        ...(toppingOptionId && {
          toppingOption: { connect: { id: selectedTopping?.id } },
        }),
      },
    });
  }

  // Calculate all cart-items
  await context.transaction(
    async (tx) => {
      const cartItems = await tx.prisma.cartItem.findMany({
        where: { cartId: cart.id },
      });
      const cartSubTotal = cartItems.reduce(
        (sum, item) => sum + Number(item.subTotal),
        0
      );

      // Update the total amount of the cart-item to the cart
      await tx.db.Cart.updateOne({
        where: { id: cart.id },
        data: {
          subTotal: cartSubTotal,
          updatedAt: new Date(),
        },
      });
    },
    { timeout: 10000 }
  );

  return context.db.Cart.findOne({
    where: { id: cart.id },
  });
};
