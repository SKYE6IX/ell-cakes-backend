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

jest.mock("../lib/paymentGateway.ts", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    createPayment: jest.fn().mockResolvedValue({
      id: "mock-payment-123",
      status: "succeeded",
      confirmation: {
        confirmation_url: "https://mock.payment.url",
      },
      amount: {
        value: "3000",
      },
      payment_method: {
        type: "bank_card",
      },
    }),
  }),
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
    const mockUser = await sudoContext.db.User.createOne({
      data: {
        name: "Jon",
        email: "test@mail.com",
        password: "12345678",
        phoneNumber: "9988776699",
      },
    });
    const mockSession = {
      listKey: "User",
      itemId: mockUser.id,
      data: { role: "ADMIN" },
    };
    const newProduct = await context
      .withSession(mockSession)
      .query.Product.createOne({
        data: {
          category: { create: { name: "cakes" } },
          images: { create: { altText: "test" } },
          name: "Fluffy Cake",
          baseDescription: "The best cake to ever grace this earth",
          type: "cake",
          variantType: "weight",
          stockQuantity: 10,
          fillings: {
            create: {
              name: "Fluffy",

              description: "fluffy description",
              ingredients: "made with everything fluffy",
              lifeShelf: 3,
              variants: {
                create: { weight: "2.5", price: 3000, serving: 5 },
              },
            },
          },
        },
        query:
          "id name stockQuantity type variantType fillings { id name variants { id weight price serving } }",
      });
    await context.withSession(mockSession).graphql.raw({
      query: `mutation AddToCart($variantId: String!) {
         addToCart(variantId: $variantId) {
          id subTotal cartItems { id quantity }
         }
       }
      `,
      variables: {
        variantId: newProduct.fillings[0].variants[0].id,
      },
    });
    const userAddress = await context
      .withSession(mockSession)
      .db.DelivaryAddress.createOne({
        data: {
          street: "No 16, mock address",
          user: { connect: { id: mockSession.itemId } },
        },
      });
    const checkOut = await context
      .withSession(mockSession)
      .graphql.raw<{ checkOut: any }, {}>({
        query: `mutation CheckOut($deliveryAddressId: String!, $shippingCost: Int!, $paymentMethod: String!) {
              checkOut(shippingCost: $shippingCost, deliveryAddressId: $deliveryAddressId, paymentMethod: $paymentMethod){
               id status amount confirmationUrl method paymentId
              }
            }`,
        variables: {
          deliveryAddressId: userAddress.id,
          shippingCost: 1000,
          paymentMethod: "bank_card",
        },
      });
    expect(checkOut.data?.checkOut.status).toEqual("pending");
    expect(checkOut.data?.checkOut.method).toEqual("bank_card");
    expect(checkOut.data?.checkOut.amount).toEqual("3000");
  });
});
