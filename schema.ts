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
import { Cart } from "./models/cart";
import { CartItem } from "./models/cart-item";
import { Order } from "./models/order";
import { OrderItem } from "./models/order-item";
import { Payment } from "./models/payment";

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
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
};
