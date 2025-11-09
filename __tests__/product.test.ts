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
describe("Product Model", () => {
  test("EDITOR can manage product", async () => {
    const editor = {
      listKey: "User",
      itemId: "1234567890",
      data: { role: "EDITOR" },
    };
    // Creating Product
    const newProduct = await context
      .withSession(editor)
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
              stockQuantity: 10,
              lifeShelf: 3,
              variants: { create: { weight: "2.5", price: 300, serving: 5 } },
            },
          },
        },
        query:
          "id name stockQuantity type variantType fillings { id name variants { id weight price serving } }",
      });
    expect(newProduct.name).toEqual("Fluffy Cake");
    expect(newProduct.type).toEqual("cake");
    expect(newProduct.variantType).toEqual("weight");
    expect(newProduct.fillings[0].name).toEqual("Fluffy");
    expect(newProduct.fillings[0].variants[0].weight).toEqual("2.5");
    expect(newProduct.fillings[0].variants[0].price).toEqual(300);
    expect(newProduct.fillings[0].variants[0].serving).toEqual(5);

    // Updating Product
    const updateProduct = await context
      .withSession(editor)
      .query.Product.updateOne({
        where: { id: newProduct.id },
        data: {
          stockQuantity: 5,
        },
        query: "id stockQuantity fillings { variants { id } }",
      });

    const updateProductVariant = await context
      .withSession(editor)
      .query.ProductVariant.updateOne({
        where: { id: newProduct.fillings[0].variants[0].id },
        data: {
          price: 600,
        },
        query: "id price",
      });

    expect(updateProduct.stockQuantity).toEqual(5);
    expect(updateProductVariant.price).toEqual(600);

    // Delete Product
    const deleteProduct = await context
      .withSession(editor)
      .query.Product.deleteOne({
        where: { id: newProduct.id },
        query: "id",
      });
    expect(deleteProduct?.id).toEqual(newProduct.id);
  });

  test("CUSTOMER can query product", async () => {
    const editor = {
      listKey: "User",
      itemId: "1234567890",
      data: { role: "EDITOR" },
    };
    const customer = {
      listKey: "User",
      itemId: "1234567890",
      data: { role: "CUSTOMER" },
    };
    await context.withSession(editor).query.Product.createOne({
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
            stockQuantity: 10,
            lifeShelf: 3,
            variants: { create: { weight: "2.5", price: 300, serving: 5 } },
          },
        },
      },
    });

    const customerQuery = await context
      .withSession(customer)
      .query.Product.findMany({
        query:
          "id name stockQuantity type variantType fillings { id name variants { id weight price serving } }",
      });

    expect(customerQuery[0].name).toEqual("Fluffy Cake");
    expect(customerQuery[0].type).toEqual("cake");
    expect(customerQuery[0].variantType).toEqual("weight");
    expect(customerQuery[0].fillings[0].name).toEqual("Fluffy");
    expect(customerQuery[0].fillings[0].variants[0].weight).toEqual("2.5");
    expect(customerQuery[0].fillings[0].variants[0].price).toEqual(300);
    expect(customerQuery[0].fillings[0].variants[0].serving).toEqual(5);
  });
});
