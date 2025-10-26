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

jest.mock("iuliia", () => ({
  translate: jest.fn((text) => text),
  WIKIPEDIA: {},
}));

jest.mock("../lib/mail.ts", () => ({
  sendVerificationEmail: jest.fn(async () => Promise.resolve()),
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

describe("Order and OrderItem Model and", () => {
  test("Only Sign in User can complete order", async () => {
    const sudoContext = context.sudo();
    const user = await sudoContext.db.User.createOne({
      data: {
        name: "Jon",
        email: "test@mail.com",
        password: "12345678",
        phoneNumber: "9988776699",
      },
    });
    const sessison = {
      listKey: "User",
      itemId: user.id,
      data: { role: "ADMIN" },
    };
    const newProduct = await context
      .withSession(sessison)
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
    await context.withSession(sessison).graphql.raw({
      query: `mutation AddToCart($productId: String!, $cartId: String!) {
            addToCart(productId: $productId, cartId: $cartId){
             id subTotal cartItems { id quantity }
            }
          }`,
      variables: { productId: newProduct.id, cartId: "" },
    });
    const userAddress = await context
      .withSession(sessison)
      .db.DelivaryAddress.createOne({
        data: {
          street: "No 16, mock address",
          user: { connect: { id: sessison.itemId } },
        },
      });
    const checkOut = await context
      .withSession(sessison)
      .graphql.raw<{ checkOut: any }, {}>({
        query: `mutation CheckOut($shippingCost: Int!, $paymentMethod: String!, $deliveryAddressId: String!) {
            checkOut(shippingCost: $shippingCost, deliveryAddressId: $deliveryAddressId, paymentMethod: $paymentMethod){
             id status amount confirmationUrl method paymentId
            }
          }`,
        variables: {
          shippingCost: 1000,
          paymentMethod: "bank_card",
          deliveryAddressId: userAddress.id,
        },
      });
    expect(checkOut.data?.checkOut.status).toEqual("pending");
    expect(checkOut.data?.checkOut.method).toEqual("bank_card");
    expect(checkOut.data?.checkOut.amount).toEqual("1333.00");
  });
});
