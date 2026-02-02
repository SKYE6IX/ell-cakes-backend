import { getContext } from "@keystone-6/core/context";
import { KeystoneContext } from "@keystone-6/core/types";
import * as cookie from "cookie";
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

jest.mock("@hapi/iron");
jest.mock("cookie");
jest.mock("../lib/getSecret");

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
  test("Only Sign in User can checkout", async () => {
    (cookie.parse as jest.Mock).mockReturnValue({
      "ell-cake-cart-id": "ENCRYPTED_COOKIE_VALUE",
    });

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
          categories: { create: [{ name: "cakes" }] },
          images: { create: { altText: "test" } },
          name: "Fluffy Cake",
          baseDescription: "The best cake to ever grace this earth",
          type: "cake",
          variantType: "weight",
          fillings: {
            create: {
              name: "Fluffy",
              description: "fluffy description",
              ingredients: "made with everything fluffy",
              variants: {
                create: { weight: "2.5", price: 3000, serving: 5 },
              },
            },
          },
          customizations: {
            create: {
              name: "CANDLE",
              customValues: {
                create: {
                  value: "5",
                  extraPrice: 100,
                },
              },
            },
          },
        },
        query:
          "id name type variantType fillings { id name variants { id weight price serving } } customizations { id customValues { id } }",
      });

    await context.withSession(mockSession).graphql.raw({
      query: `mutation AddToCart($productId: String!, $variantId: String!, $customizations: [CustomizationInput!]) {
               addToCart(productId: $productId, variantId: $variantId, customizations: $customizations) {
                id subTotal cartItems { id quantity }
               }
             }
            `,
      variables: {
        productId: newProduct.id,
        variantId: newProduct.fillings[0].variants[0].id,
        customizations: [
          {
            optionId: newProduct.customizations[0].id,
            valueId: newProduct.customizations[0].customValues[0].id,
            inscriptionText: null,
            imagesId: null,
          },
        ],
      },
    });

    const userAddress = await context
      .withSession(mockSession)
      .db.DelivaryAddress.createOne({
        data: {
          address: "No 16, mock address",
          user: { connect: { id: mockSession.itemId } },
        },
      });

    const checkOut = await context
      .withSession(mockSession)
      .graphql.raw<{ checkOut: any }, {}>({
        query: `mutation CheckOut($deliveryAddressId: String!, $shippingCost: Int!, $deliveryOption: String!, $paymentMethod: String!) {
              checkOut(shippingCost: $shippingCost, deliveryAddressId: $deliveryAddressId, paymentMethod: $paymentMethod, deliveryOption: $deliveryOption) {
               id status amount redirectUrl method
              }
            }`,
        variables: {
          deliveryAddressId: userAddress.id,
          shippingCost: 1000,
          paymentMethod: "bank_card",
          deliveryOption: "between 10:00 to 17:00",
        },
      });

    expect(checkOut.data?.checkOut.status).toEqual("PENDING");
    expect(checkOut.data?.checkOut.method).toEqual("bank_card");
    expect(checkOut.data?.checkOut.amount).toEqual("3000");
  });
});
