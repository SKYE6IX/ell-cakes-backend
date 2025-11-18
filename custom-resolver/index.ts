import type { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { verifyUserByPhoneNumber } from "./verifyUserByPhoneNumber";
import { addToCart } from "./addToCart";
import { removeFromCart } from "./removeFromCart";
import { checkOut } from "./checkOut";
import { registerUser } from "./registerUser";
import { registerUserWithCart } from "./registerUserWithCart";
import { authorizedUserWithCart } from "./authorizedUserWithCart";
import { resendVerificationToken } from "./resendVerificationToken";
import { uploadImageCustomization } from "./uploadImageCustomization";

export const customExtendResolvers = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: `
    type VerifyUserByPhoneNumberResponse {
      status: Boolean
      message: String
    }  

    input RegisterUserInput {
     name: String!
     email: String!
     password: String!
     phoneNumber: String!
    }

    input CustomizationInput {
      optionId: String!
      valueId: String!
      inscriptionText: String
      imageId: String
    }

    input CompositionOptionInput {
      productId: String!
      quantity: Int!
    }

    type Mutation {
        verifyUserByPhoneNumber(token: String!, phoneNumber: String!): VerifyUserByPhoneNumberResponse!
        resendVerificationToken(phoneNumber: String!): String!
        addToCart(productId: String!, variantId: String!, customizations: [CustomizationInput!], compositionOptions: [CompositionOptionInput!], toppingOptionId: String, cartId: String): Cart!
        removeFromCart(cartItemId: String!, cartId: String!): Cart!
        checkOut(deliveryAddressId: String!, shippingCost: Int!, paymentMethod: String!, customerNote: String): Payment!
        registerUser(registerData: RegisterUserInput!): User!
        registerUserWithCart(cartId: String!, registerData: RegisterUserInput!): User!
        authorizedUserWithCart(email: String!, password: String!, cartId: String): User!
        uploadImageCustomization(files: [Upload!]!): [OrderImage!]!
    }
    `,
    resolvers: {
      Mutation: {
        verifyUserByPhoneNumber,
        resendVerificationToken,
        addToCart,
        removeFromCart,
        checkOut,
        registerUser,
        registerUserWithCart,
        authorizedUserWithCart,
        uploadImageCustomization,
      },
    },
  });
};
