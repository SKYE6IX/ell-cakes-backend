import { customAlphabet } from "nanoid";

export const issuePhoneNumberToken = async ({
  phoneNumber,
}: {
  phoneNumber: string;
}) => {
  const nanoid = customAlphabet("0123456789", 6);

  const token = nanoid();

  const issuedAt = new Date();

  //TODO:
  //Set up SMS service that will send the token to the USER phone number
  return {
    token,
    issuedAt,
  };
};

// Where do we need to issue a phone number token

// Registration point -> session available
// When user update their profile and they change number -> session available
// When user didn't complete verification on registration, they can request for this - session available
// When user need to change their password because they are unable to sign in - session isn't available
