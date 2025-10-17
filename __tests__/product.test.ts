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
import { Readable } from "stream";

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
    const productImage = await context.prisma.ProductImage.create({
      data: {
        image_id: "stub_id",
        image_extension: "jpg",
        altText: "test",
      },
    });
    const category = await context
      .withSession(editor)
      .query.Category.createOne({
        data: { name: "cakes" },
        query: "id",
      });

    // Creating Product
    const newProduct = await context
      .withSession(editor)
      .query.Product.createOne({
        data: {
          category: { connect: { id: category.id } },
          images: { connect: { id: productImage.id } },
          name: "Fluffy Cake",
          description: "The best cake to ever grace this earth",
          price: "333.00",
          ingredients: "made with everything fluffy",
          stockQuantity: 10,
          lifeShelf: 3,
        },
        query: "id name lifeShelf stockQuantity",
      });

    expect(newProduct.name).toEqual("Fluffy Cake");
    expect(newProduct.lifeShelf).toBeGreaterThan(2);
    expect(newProduct.stockQuantity).toBeLessThan(20);

    // Updating Product
    const updateProduct = await context
      .withSession(editor)
      .query.Product.updateOne({
        where: { id: newProduct.id },
        data: {
          price: "150.00",
          stockQuantity: 5,
        },
        query: "id price stockQuantity",
      });

    expect(updateProduct.price).toEqual("150.00");
    expect(updateProduct.stockQuantity).toBeLessThan(10);

    // Updating Product
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

    const productImage = await context.prisma.ProductImage.create({
      data: {
        image_id: "stub_id",
        image_extension: "jpg",
        altText: "test",
      },
    });

    const category = await context
      .withSession(editor)
      .query.Category.createOne({
        data: { name: "cakes" },
        query: "id",
      });
    await context.withSession(editor).query.Product.createOne({
      data: {
        category: { connect: { id: category.id } },
        images: { connect: { id: productImage.id } },
        name: "Fluffy Cake",
        description: "The best cake to ever grace this earth",
        price: "333.00",
        ingredients: "made with everything fluffy",
        stockQuantity: 10,
        lifeShelf: 3,
      },
      query: "id name lifeShelf stockQuantity",
    });

    const customerQuery = await context
      .withSession(customer)
      .query.Product.findMany({ query: "id name price stockQuantity" });

    expect(customerQuery[0].name).toEqual("Fluffy Cake");
    expect(customerQuery[0].price).toEqual("333.00");
    expect(customerQuery[0].stockQuantity).toBeGreaterThan(5);
  });
});
