import type { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { verifyEmail } from "./verifyEmail";

export const customExtendResolvers = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: `
    type VerifyEmailResponse {
        status: Boolean
        message: String
    }  
    type Mutation {
        verifyEmail(token: String!, email: String!): VerifyEmailResponse
    }  
    `,
    resolvers: {
      Mutation: {
        verifyEmail,
      },
    },
  });
};
