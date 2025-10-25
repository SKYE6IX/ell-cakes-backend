import type { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { verifyEmail } from "./verifyEmail";
import { addToCart } from "./addToCart";
import { removeFromCart } from "./removeFromCart";
import { checkOut } from "./checkOut";

export const customExtendResolvers = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: `
    type VerifyEmailResponse {
      status: Boolean
      message: String
    }   
    input CustomizationInput {
      keyId: String!
      valueId: String!
    }
    type Mutation {
        verifyEmail(token: String!, email: String!): VerifyEmailResponse
        addToCart(productId: String!, variantId: String, customizations: [CustomizationInput!], toppingId: String, cartId: String!): Cart!
        removeFromCart(cartItemId: String!, cartId: String!): Cart!
        checkOut(shippingCost: Int!, paymentMethod: String!): Payment!
    }
    `,
    resolvers: {
      Mutation: {
        verifyEmail,
        addToCart,
        removeFromCart,
        checkOut,
      },
    },
  });
};
