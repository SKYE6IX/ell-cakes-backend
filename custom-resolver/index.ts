import type { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { verifyUserByPhoneNumber } from "./verifyUserByPhoneNumber";
import { addToCart } from "./addToCart";
import { removeFromCart } from "./removeFromCart";
import { checkOut } from "./checkOut";
import { registerUser } from "./registerUser";
import { authorizedUser } from "./authorizedUser";
import { resendVerificationToken } from "./resendVerificationToken";
import { uploadImageCustomization } from "./uploadImageCustomization";
import { queryCart } from "./queryCart";

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
      imagesId: [String!]
    }

    input CompositionOptionInput {
      productId: String!
      quantity: Int!
    }
    
    type Query {
      queryCart: Cart
    }

    type Mutation {
        authorizedUser(email: String!, password: String!): User!
        verifyUserByPhoneNumber(token: String!, phoneNumber: String!): VerifyUserByPhoneNumberResponse!
        resendVerificationToken(phoneNumber: String!): String!
        addToCart(productId: String!, variantId: String!, customizations: [CustomizationInput!], compositionOptions: [CompositionOptionInput!], toppingOptionId: String): Cart!
        removeFromCart(cartItemId: String!): Cart!
        checkOut(deliveryAddressId: String!, shippingCost: Int!, paymentMethod: String!, customerNote: String): Payment!
        registerUser(registerData: RegisterUserInput!): User!
        uploadImageCustomization(files: [Upload!]!): [CustomizeImage!]!
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
        authorizedUser,
        uploadImageCustomization,
      },

      Query: {
        queryCart,
      },
    },
  });
};
