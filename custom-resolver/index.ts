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
import { increaseCartItem } from "./increaseCartItem";
import { decreaseCartItem } from "./decreaseCartItem";
import { isEmailInUse } from "./isEmailInUse";
import { isPhoneNumberInUse } from "./isPhoneNumberInUse";
import { queryCart } from "./queryCart";
import { queryAuthorizedUser } from "./queryAuthorizedUser";

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
      isEmailInUse(email: String!): Boolean!
      isPhoneNumberInUse(phoneNumber: String!): Boolean!
      queryAuthorizedUser: User
    }

    type Mutation {
        authorizedUser(email: String!, password: String!): User!
        verifyUserByPhoneNumber(token: String!, phoneNumber: String!): VerifyUserByPhoneNumberResponse!
        resendVerificationToken(phoneNumber: String!): String!
        addToCart(productId: String!, variantId: String!, customizations: [CustomizationInput!], compositionOptions: [CompositionOptionInput!], toppingOptionId: String): Cart!
        increaseCartItem(cartItemId: String!): Cart!
        decreaseCartItem(cartItemId: String!): Cart
        removeFromCart(cartItemId: String!): Cart
        checkOut(deliveryAddressId: String!, shippingCost: Int!, paymentMethod: String!, customerNote: String): Payment!
        registerUser(registerData: RegisterUserInput!): User!
        uploadImageCustomization(files: [Upload!]!): [CustomizeImage!]!
    }
    `,

    resolvers: {
      Mutation: {
        verifyUserByPhoneNumber,
        resendVerificationToken,
        increaseCartItem,
        addToCart,
        removeFromCart,
        decreaseCartItem,
        checkOut,
        registerUser,
        authorizedUser,
        uploadImageCustomization,
      },

      Query: {
        queryCart,
        isEmailInUse,
        isPhoneNumberInUse,
        queryAuthorizedUser,
      },
    },
  });
};
