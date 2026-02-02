import { getContext } from "@keystone-6/core/context";
import { KeystoneContext } from "@keystone-6/core/types";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { resetDatabase } from "@keystone-6/core/testing";
import * as PrismaModule from ".prisma/client";
import baseConfig from "../keystone";
import { issueVerificationToken } from "../lib/issueVerificationToken";
import path from "path";
import { Prisma } from ".prisma/client";

type User = Prisma.UserGetPayload<{}>;

interface GraphQLResponse<T> {
  data: {
    redeemUserVerificationToken: T;
  };
  errors?: any[];
}

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

jest.mock("../lib/issueVerificationToken");

describe("Verify user by phone number", () => {
  test("It send phone number token to user", async () => {
    // Arrange
    (issueVerificationToken as jest.Mock).mockResolvedValue({
      token: "12345678",
      issuedAt: new Date(),
    });

    const sudoContext = context.sudo();
    const newUser = (await sudoContext.db.User.createOne({
      data: {
        name: "Jon",
        email: "test@mail.com",
        password: "12345678",
        phoneNumber: "9932707338",
      },
    })) as User;

    expect(newUser.userVerificationToken).toBeDefined();
  });

  test("it redeem token from user", async () => {
    const token = "12345678";
    // Arrange
    (issueVerificationToken as jest.Mock).mockResolvedValue({
      token,
      issuedAt: new Date(),
    });

    const sudoContext = context.sudo();

    const user = (await sudoContext.db.User.createOne({
      data: {
        name: "Jon",
        email: "test@mail.com",
        password: "12345678",
        phoneNumber: "9932707338",
      },
    })) as User;

    const mockSession = {
      listKey: "User",
      itemId: user.id,
      data: { role: "CUSTOMER" },
    };

    const { data, errors } = (await context
      .withSession(mockSession)
      .graphql.raw({
        query: `
      mutation RedeemUserVerificationToken($token: String!, $email: String!) {
        redeemUserVerificationToken(token: $token, email: $email) {
           status
           message
        }
      }
      `,
        variables: { token, email: user.email },
      })) as GraphQLResponse<{ status: boolean }>;

    expect(data.redeemUserVerificationToken.status).toBeTruthy();

    const updatedUser = (await sudoContext.db.User.findOne({
      where: { id: user.id },
    })) as User;

    expect(updatedUser.isUserVerified).toBeTruthy();
    expect(updatedUser.userVerificationToken).toBeNull();
  });
});
