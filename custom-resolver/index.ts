import type { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { redeemPhoneNumberToken } from "./redeemPhoneNumberToken";
import { addToCart } from "./addToCart";
import { removeFromCart } from "./removeFromCart";
import { checkOut } from "./checkOut";
import { registerUser } from "./registerUser";
import { authorizedUser } from "./authorizedUser";
import { resendPhoneNumberToken } from "./resendPhoneNumberToken";
import { uploadImageCustomization } from "./uploadImageCustomization";
import { increaseCartItem } from "./increaseCartItem";
import { decreaseCartItem } from "./decreaseCartItem";
import { isEmailInUse } from "./isEmailInUse";
import { isPhoneNumberInUse } from "./isPhoneNumberInUse";
import { queryCart } from "./queryCart";
import { queryAuthorizedUser } from "./queryAuthorizedUser";
import { connectCartToUser } from "./connectCartToUser";
import { sendPasswordResetToken } from "./sendPasswordResetToken";
import { validatePasswordResetToken } from "./validatePasswordResetToken";
import { updatePassword } from "./updatePassword";

export const customExtendResolvers = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: `
    type VerifyUserByPhoneNumberResponse {
      status: Boolean
      message: String
    }
      
    type PasswordResetTokenResponse {
      passwordResetUrl: String!
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
      validatePasswordResetToken(token: String!, email: String!): Boolean!
    }

    type Mutation {
        authorizedUser(email: String!, password: String!): User!
        redeemPhoneNumberToken(token: String!, phoneNumber: String!): VerifyUserByPhoneNumberResponse!
        resendPhoneNumberToken(phoneNumber: String!): String!
        sendPasswordResetToken(phoneNumber: String!): PasswordResetTokenResponse!
        updatePassword(token: String!, email: String!, newPassword: String!): User!
        addToCart(productId: String!, variantId: String!, customizations: [CustomizationInput!], compositionOptions: [CompositionOptionInput!], toppingOptionId: String): Cart!
        increaseCartItem(cartItemId: String!): Cart!
        decreaseCartItem(cartItemId: String!): Cart
        removeFromCart(cartItemId: String!): Cart
        connectCartToUser(userId: String!): Cart!
        checkOut(deliveryAddressId: String!, shippingCost: Int!, paymentMethod: String!, customerNote: String): Payment!
        registerUser(registerData: RegisterUserInput!): User!
        uploadImageCustomization(files: [Upload!]!): [CustomizeImage!]!
    }
    `,

    resolvers: {
      Mutation: {
        redeemPhoneNumberToken,
        resendPhoneNumberToken,
        increaseCartItem,
        addToCart,
        removeFromCart,
        decreaseCartItem,
        checkOut,
        registerUser,
        authorizedUser,
        uploadImageCustomization,
        connectCartToUser,
        sendPasswordResetToken,
        updatePassword,
      },

      Query: {
        queryCart,
        isEmailInUse,
        isPhoneNumberInUse,
        queryAuthorizedUser,
        validatePasswordResetToken,
      },
    },
  });
};
