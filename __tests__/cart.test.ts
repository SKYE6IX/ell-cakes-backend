import { getContext } from "@keystone-6/core/context";
import { KeystoneContext } from "@keystone-6/core/types";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { resetDatabase } from "@keystone-6/core/testing";
import * as PrismaModule from ".prisma/client";
import baseConfig from "../keystone";
import path from "path";
import type { CartWithItem } from "../custom-resolver/addToCart";

interface GraphQLResponse<T> {
  data: {
    addToCart: T;
    removeFromCart: T;
  };
  errors?: any[];
}

jest.mock("iuliia", () => ({
  translate: jest.fn((text) => text),
  WIKIPEDIA: {},
}));

const IMAGE = "postgres:16-alpine";
const prismaSchemaPath = path.join(process.cwd(), "schema.prisma");
const config = {
  ...baseConfig,
};

let container: StartedPostgreSqlContainer;
let context: KeystoneContext<any>;

beforeAll(async () => {
  container = await new PostgreSqlContainer(IMAGE).start();
  config.db.url = container.getConnectionUri();
  context = getContext(config, PrismaModule);
}, 60000);

afterAll(async () => {
  await container.stop();
});

beforeEach(async () => {
  await resetDatabase(container.getConnectionUri(), prismaSchemaPath);
});

describe("cart and cart-item Model", () => {
  test("Adding and Updating Cart", async () => {
    const editor = {
      listKey: "User",
      itemId: "1234567890",
      data: { role: "EDITOR" },
    };
    const newProduct = await context
      .withSession(editor)
      .query.Product.createOne({
        data: {
          category: { create: { name: "cakes" } },
          images: { create: { altText: "test" } },
          name: "Fluffy Cake",
          description: "The best cake to ever grace this earth",
          basePrice: 333,
          ingredients: "made with everything fluffy",
          stockQuantity: 10,
          lifeShelf: 3,
        },
        query: "id name lifeShelf stockQuantity",
      });
    const cart = (await context.graphql.raw({
      query: `mutation AddToCart($productId: String!, $cartId: String!) {
        addToCart(productId: $productId, cartId: $cartId){
         id subTotal cartItems { id quantity }
        }
      }`,
      variables: { productId: newProduct.id, cartId: "" },
    })) as GraphQLResponse<CartWithItem>;

    expect(cart.data.addToCart.subTotal).toEqual(333);
    expect(cart.data.addToCart.cartItems[0].quantity).toEqual(1);
    const updatedCart = (await context.graphql.raw({
      query: `mutation AddToCart($productId: String!, $cartId: String!) {
        addToCart(productId: $productId, cartId: $cartId){
         id subTotal cartItems { id quantity }
        }
      }`,
      variables: { productId: newProduct.id, cartId: cart.data.addToCart.id },
    })) as GraphQLResponse<CartWithItem>;
    expect(updatedCart.data.addToCart.cartItems[0].quantity).toEqual(2);
    expect(updatedCart.data.addToCart.subTotal).toEqual(333 * 2);
  });

  test("Remove item from cart", async () => {
    const editor = {
      listKey: "User",
      itemId: "1234567890",
      data: { role: "EDITOR" },
    };
    const newProduct = await context
      .withSession(editor)
      .query.Product.createOne({
        data: {
          category: { create: { name: "cakes" } },
          images: { create: { altText: "test" } },
          name: "Fluffy Cake",
          description: "The best cake to ever grace this earth",
          basePrice: 333,
          ingredients: "made with everything fluffy",
          stockQuantity: 10,
          lifeShelf: 3,
        },
        query: "id name lifeShelf stockQuantity",
      });

    const cart = (await context.graphql.raw({
      query: `mutation AddToCart($productId: String!, $cartId: String!) {
        addToCart(productId: $productId, cartId: $cartId){
         id subTotal cartItems { id quantity }
        }
      }`,
      variables: { productId: newProduct.id, cartId: "" },
    })) as GraphQLResponse<CartWithItem>;

    const removeCart = (await context.graphql.raw({
      query: `mutation RemoveFromCart($cartItemId: String!, $cartId: String!) {
        removeFromCart(cartItemId: $cartItemId, cartId: $cartId){
         id subTotal cartItems { id }
        }
      }`,
      variables: {
        cartItemId: cart.data.addToCart.cartItems[0].id,
        cartId: cart.data.addToCart.id,
      },
    })) as GraphQLResponse<CartWithItem>;
    expect(removeCart.data.removeFromCart.cartItems.length).toEqual(0);
    expect(removeCart.data.removeFromCart.subTotal).toEqual(0);
  });
});
