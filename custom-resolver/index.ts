import type { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { verifyEmail } from "./verifyEmail";
import { addToCart } from "./addToCart";
import { removeFromCart } from "./removeFromCart";
import { checkOut } from "./checkOut";
import { registerUser } from "./registerUser";
import { registerUserWithCart } from "./registerUserWithCart";
import { authorizedUserWithCart } from "./authorizedUserWithCart";

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
    input RegisterUserInput {
     name: String!
     email: String!
     password: String!
     phoneNumber: String!
    }  
    type Mutation {
        verifyEmail(token: String!, email: String!): VerifyEmailResponse
        addToCart(productId: String!, variantId: String, customizations: [CustomizationInput!], toppingId: String, cartId: String!): Cart!
        removeFromCart(cartItemId: String!, cartId: String!): Cart!
        checkOut(shippingCost: Int!, paymentMethod: String!, deliveryAddressId: String!, customerNote: String): Payment!
        registerUser(registerData: RegisterUserInput!): User!
        registerUserWithCart(cartId: String!, registerData: RegisterUserInput!): User!
        authorizedUserWithCart(email: String!, password: String!, cartId: String): User!
    }
    `,
    resolvers: {
      Mutation: {
        verifyEmail,
        addToCart,
        removeFromCart,
        checkOut,
        registerUser,
        registerUserWithCart,
        authorizedUserWithCart,
      },
    },
  });
};
