import { Prisma } from "@prisma/client";
import { Context } from ".keystone/types";
import type { Session } from "../access";

interface AddToCartArgs {
  productId: string;
  variantId: string | null;
  customizations: { keyId: string; valueId: string }[] | null;
  toppingId: string | null;
  cartId: string;
}
export type CartWithItem = Prisma.CartGetPayload<{
  include: { cartItems: true };
}>;

export const addToCart = async (
  root: any,
  { productId, variantId, customizations, toppingId, cartId }: AddToCartArgs,
  context: Context
) => {
  let cart: CartWithItem | null = null;

  const loggedInUser = context.session as Session;

  // If user is in session
  if (loggedInUser) {
    cart = await context.prisma.cart.findUnique({
      where: { userId: loggedInUser.itemId },
      include: { cartItems: true },
    });
    // If user isn't in session but they already create a cart
  } else if (cartId) {
    cart = await context.prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: true },
    });
  }

  if (cart === null) {
    cart = await context.prisma.cart.create({
      data: {
        ...(loggedInUser && { user: { connect: { id: loggedInUser.itemId } } }),
      },
      include: { cartItems: true },
    });
  }

  //Query the product along with it's related variants and customization data
  const product = await context.prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: true,
      customization: {
        include: { customOptions: { include: { customValues: true } } },
      },
      topping: { include: { options: true } },
    },
  });

  const productVariant = product?.variants.find(
    (variant) => variant.id === variantId
  );

  // Calculate amount for customization added if they have extra price
  let customizationsTotalAmount = 0;
  const customizationSnapShot =
    customizations?.map((customize) => {
      const customOption = product?.customization?.customOptions.find(
        (opt) => opt.id === customize.keyId
      );
      const valueOption = customOption?.customValues.find(
        (val) => val.id === customize.valueId
      );
      const extraPrice = valueOption?.extraPrice ?? 0;
      // Add all the value extra price
      customizationsTotalAmount += extraPrice;
      return {
        name: customOption?.name || "",
        customValue: {
          value: valueOption?.value || "",
          extraPrice: valueOption?.extraPrice || 0,
        },
      };
    }) ?? null;

  // Get the current selected topping if user chose a topping is provided
  const selectedTopping = product?.topping?.options.find(
    (topping) => topping.id === toppingId
  );

  // Check for existing cart-item
  const existCartItem = cart.cartItems.find((item) => {
    const sameProduct = item.productId === productId;
    const sameVariant = (item.variantId ?? null) === (variantId ?? null);
    const sameTopping = (item.toppingId ?? null) === (toppingId ?? null);
    const sameCustomization =
      JSON.stringify(item.customizationSnapShot) ===
      JSON.stringify(customizationSnapShot);
    return sameProduct && sameVariant && sameTopping && sameCustomization;
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
    // Calculate the unit price for a single product
    const basePrice = (productVariant?.price ?? product?.basePrice) || 0;
    const toppingPrice = selectedTopping?.extraPrice || 0;
    const unitPrice = basePrice + customizationsTotalAmount + toppingPrice;

    // Create a new cart-item
    // Default value for quantity is 1 when created
    await context.db.CartItem.createOne({
      data: {
        cart: { connect: { id: cart.id } },
        product: { connect: { id: productId } },
        unitPrice: unitPrice,
        subTotal: unitPrice * 1,
        productSnapShot: {
          id: productId,
          name: product?.name || "",
          basePrice: basePrice,
        },
        ...(variantId && {
          variant: { connect: { id: variantId } },
          variantSnapShot: {
            id: productVariant?.id || "",
            weight: productVariant?.weight?.toString() || "",
            price: productVariant?.price || 0,
          },
        }),
        ...(customizations && { customizationSnapShot: customizationSnapShot }),
        ...(toppingId && { topping: { connect: { id: selectedTopping?.id } } }),
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
      await tx.prisma.cart.update({
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
