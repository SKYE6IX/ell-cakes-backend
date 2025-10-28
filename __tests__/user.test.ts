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

describe("User Model", () => {
  test("new user are allowed to create account", async () => {
    // Arrange
    const sudoContext = context.sudo();
    const newUser = await sudoContext.db.User.createOne({
      data: {
        name: "Jon",
        email: "test@mail.com",
        password: "12345678",
        phoneNumber: "9988776699",
      },
    });
    // Assert
    expect(newUser.name).toEqual("Jon");
    expect(newUser.email).toEqual("test@mail.com");
    expect(newUser.role).toEqual("CUSTOMER");
    expect(newUser.password).toBeDefined();
  });

  test("User can update their profile", async () => {
    // Arrange
    const sudoContext = context.sudo();
    const newUser = await sudoContext.db.User.createOne({
      data: {
        name: "Jon",
        email: "test@mail.com",
        password: "12345678",
        phoneNumber: "9988776699",
      },
    });
    // Act
    const userUpdate = await context
      .withSession({
        listKey: "User",
        itemId: newUser.id,
        data: { role: "CUSTOMER" },
      })
      .db.User.updateOne({
        where: { id: newUser.id },
        data: { name: "Mike", phoneNumber: "999444666" },
      });
    // Assert
    expect(userUpdate.name).toEqual("Mike");
    expect(userUpdate.phoneNumber).toEqual("999444666");
  });
});
