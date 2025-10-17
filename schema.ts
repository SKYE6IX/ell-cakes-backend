import { Product } from "./models/product";
import { User } from "./models/user";
import { ProductImage } from "./models/product-image";
import { ProductVariant } from "./models/product-variant";
import { Category } from "./models/category";
import { DelivaryAddress } from "./models/delivary-address";
import { ProductCustomization } from "./models/product-customization";
import { CustomizationOption } from "./models/customization-option";
import { CustomizationOptionValue } from "./models/customization-option-value";
import { Topping } from "./models/topping";
import { ToppingOption } from "./models/topping-option";
import { CustomizationOptionConstraint } from "./models/customization-option-constraint";

export const lists = {
  User,
  DelivaryAddress,
  Product,
  ProductImage,
  ProductVariant,
  Category,
  ProductCustomization,
  CustomizationOption,
  CustomizationOptionValue,
  Topping,
  ToppingOption,
  CustomizationOptionConstraint,
};
