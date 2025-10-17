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
import { sendVerificationEmail } from "../lib/mail";

const IMAGE = "postgres:16-alpine";
const prismaSchemaPath = path.join(process.cwd(), "schema.prisma");
const config = {
  ...baseConfig,
};

let container: StartedPostgreSqlContainer;
let context: KeystoneContext<any>;

jest.mock("../lib/mail.ts", () => ({
  sendVerificationEmail: jest.fn(async () => Promise.resolve()),
}));

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
  test("Create a new user", async () => {
    // Arrange
    const newUser = await context.db.User.createOne({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "jondoe@mail.com",
        password: "secret-password",
        phoneNumber: "12345672345",
      },
    });
    // Assert
    expect(newUser.firstName).toEqual("John");
    expect(newUser.email).toEqual("jondoe@mail.com");
    expect(newUser.role).toEqual("CUSTOMER");
    expect(newUser.password).toBeDefined();
    expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
    expect(newUser.emailVerificationIssuedAt).toBeDefined();
    expect(newUser.emailVerificationToken).toBeDefined();
  });

  test("User can update their profile", async () => {
    // Arrange
    const newUser = await context.db.User.createOne({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "jondoe@mail.com",
        password: "secret-password",
        phoneNumber: "12345672345",
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
        data: { lastName: "Don", phoneNumber: "999444666" },
      });

    // Assert
    expect(userUpdate.lastName).toEqual("Don");
    expect(userUpdate.phoneNumber).toEqual("999444666");
  });
});
