import { getContext } from "@keystone-6/core/context";
import { KeystoneContext } from "@keystone-6/core/types";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { resetDatabase } from "@keystone-6/core/testing";
import * as PrismaModule from ".prisma/client";
import baseConfig from "../keystone";
import { createOrder } from "../custom-resolver/createOrder";
import path from "path";

const IMAGE = "postgres:16-alpine";
const prismaSchemaPath = path.join(process.cwd(), "schema.prisma");
const config = {
  ...baseConfig,
};

let container: StartedPostgreSqlContainer;
let context: KeystoneContext<any>;

jest.mock("nanoid");

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

describe("Creating a new order", () => {
  it("Create and return new order ", async () => {
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
          stockQuantity: 10,
          fillings: {
            create: {
              name: "Fluffy",
              description: "fluffy description",
              ingredients: "made with everything fluffy",
              lifeShelf: 3,
              stockQuantity: 10,
              variants: {
                create: { weight: "2.5", price: 3000, serving: 5 },
              },
            },
          },
          customization: {
            create: {
              customOptions: {
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
          },
        },
        query:
          "id name stockQuantity type variantType fillings { id name variants { id weight price serving } } customization { customOptions { id customValues { id } } }",
      });

    const cart = await context.withSession(mockSession).graphql.raw({
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
            optionId: newProduct.customization.customOptions[0].id,
            valueId:
              newProduct.customization.customOptions[0].customValues[0].id,
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

    const payment = await sudoContext.db.Payment.createOne({
      data: {
        status: "PENDING",
      },
    });

    // Create a new Order Intent
    const orderIntent = await sudoContext.db.OrderIntent.createOne({
      data: {
        intentId: "mock-id-1234",
        yooMoneyId: "mock-yoo-money-id",
        // @ts-ignore
        cart: { connect: { id: cart.data.addToCart.id } },
        user: { connect: { id: mockUser.id } },
        deliveryAddress: { connect: { id: userAddress.id } },
        // @ts-ignore
        totalAmount: cart.data.addToCart.subTotal,
        paymentStatus: "PENDING",
        paymentId: payment.id,
      },
    });

    const newOrder = await createOrder({ context, orderIntent });

    expect(newOrder?.status).toEqual("PROCESSING");
    expect(newOrder?.userId).toEqual(mockUser.id);
    expect(newOrder?.orderIntentId).toEqual(orderIntent.id);
  });
});
