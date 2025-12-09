import { getContext } from "@keystone-6/core/context";
import { KeystoneContext } from "@keystone-6/core/types";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { resetDatabase } from "@keystone-6/core/testing";
import * as PrismaModule from ".prisma/client";
import baseConfig from "../keystone";
import { issuePhoneNumberToken } from "../lib/issuePhoneNumberToken";
import path from "path";
import { Prisma } from ".prisma/client";

type User = Prisma.UserGetPayload<{}>;

interface GraphQLResponse<T> {
  data: {
    sendPasswordResetToken: T;
    validatePasswordResetToken: T;
    updatePassword: T;
  };
  errors?: any[];
}

function mockReq(overrides = {}) {
  return {
    headers: {},
    cookies: {},
    query: {},
    body: {},
    ...overrides,
  };
}

function mockRes() {
  const cookies = {};
  return {
    cookies,
    setHeader: jest.fn(),
    cookie: jest.fn((name, value, opts) => {
      // @ts-expect-error
      cookies[name] = { value, opts };
    }),
  };
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
jest.mock("../lib/issuePhoneNumberToken");

describe("Resetting user password", () => {
  test("It send user a password reset token", async () => {
    // Arrange
    const token = "12345678";
    (issuePhoneNumberToken as jest.Mock).mockResolvedValue({
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

    const { data, errors } = (await context.graphql.raw({
      query: `
        mutation SendPasswordResetToken($phoneNumber: String!) {
          sendPasswordResetToken(phoneNumber: $phoneNumber) {
           passwordResetUrl
          }
        }
      `,
      variables: { phoneNumber: user.phoneNumber },
    })) as GraphQLResponse<{ passwordResetUrl: string }>;

    const url = new URL(data.sendPasswordResetToken.passwordResetUrl);
    expect(url.searchParams.get("email")).toEqual(user.email);

    const updatedUser = (await sudoContext.db.User.findOne({
      where: { id: user.id },
    })) as User;

    expect(updatedUser.passwordResetToken).toBeDefined();
    expect(updatedUser.passwordResetIssuedAt).toBeDefined();
  });

  test("it validated the token passed is a match", async () => {
    const token = "12345678";
    (issuePhoneNumberToken as jest.Mock).mockResolvedValue({
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

    await context.graphql.raw({
      query: `
        mutation SendPasswordResetToken($phoneNumber: String!) {
          sendPasswordResetToken(phoneNumber: $phoneNumber) {
           passwordResetUrl
          }
        }
      `,
      variables: { phoneNumber: user.phoneNumber },
    });

    const { data, errors } = (await context.graphql.raw({
      query: `
        query Query($token: String!, $email: String!) {
         validatePasswordResetToken(token: $token, email: $email)
        }
      `,
      variables: { token, email: user.email },
    })) as GraphQLResponse<boolean>;

    expect(data.validatePasswordResetToken).toBeTruthy();
  });

  test("it update and reset user password", async () => {
    const req = mockReq();
    const res = mockRes();

    // @ts-expect-error unable to pass all type to req
    const withRequest = await context.withRequest(req, res);

    const token = "12345678";
    (issuePhoneNumberToken as jest.Mock).mockResolvedValue({
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

    await context.graphql.raw({
      query: `
        mutation SendPasswordResetToken($phoneNumber: String!) {
          sendPasswordResetToken(phoneNumber: $phoneNumber) {
           passwordResetUrl
          }
        }
      `,
      variables: { phoneNumber: user.phoneNumber },
    });

    const newPassword = "123456789";

    const { data, errors } = (await withRequest.graphql.raw({
      query: `
      mutation UpdatePassword($token: String!, $email: String!, $newPassword: String!) {
       updatePassword(token: $token, email: $email, newPassword: $newPassword) {
           id
        }
       }
      `,
      variables: { token, email: user.email, newPassword },
    })) as GraphQLResponse<User>;

    expect(data.updatePassword.id).toEqual(user.id);

    const updatedUser = (await sudoContext.db.User.findOne({
      where: { id: user.id },
    })) as User;

    expect(updatedUser.passwordResetToken).toBeNull();
    expect(updatedUser.passwordResetRedeemedAt).toBeDefined();
  });
});
