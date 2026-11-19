// @ts-expect-error Upload.mjs was exported from the type
import Upload from "graphql-upload/Upload.js";
import { Context } from ".keystone/types";
import { processUploadImages } from "../utils/processCustomUploadImage";
import { sendCustomCakeRequest } from "../lib/mail";

interface RequestForCustomCakeInput {
  shape: string;
  filling: string;
  stackLevel: string;
  guestNum: string;
  colorPallete: string;
  allergies: string;
  textDescription: string;
  decorations: string;
  refPhoto: Upload[] | null;
  eventDate: string;
  occassion: string;
  name: string;
  phoneNumber: string;
  address: string;
}

interface GraphQLResponse {
  data: {
    customizeImage: {
      image: {
        url: string;
      };
    };
  };
  errors?: any[];
}

export const requestForCustomCake = async (
  root: any,
  { requestForCustomCakeInput }: { requestForCustomCakeInput: RequestForCustomCakeInput },
  context: Context,
) => {
  if (requestForCustomCakeInput.refPhoto) {
    const sudoContext = context.sudo();

    // We only expect upload image
    const uploadFile = requestForCustomCakeInput.refPhoto[0];
    const resolveFile = await uploadFile;

    const imageData = await processUploadImages(resolveFile);
    const upload = new Upload();
    upload.resolve(imageData);

    const newImage = await sudoContext.query.CustomizeImage.createOne({
      data: {
        image: { upload: upload },
        altText: imageData.filename,
      },
    });

    const uploadedImage = (await sudoContext.graphql.raw({
      query: `
      query Query($where: CustomizeImageWhereUniqueInput!) {
          customizeImage(where: $where) {
            image {
              url
            }
          }
      }
      `,
      variables: {
        where: {
          id: newImage.id,
        },
      },
    })) as GraphQLResponse;

    if (uploadedImage.errors) {
      throw new Error("Uploading image failed!");
    }

    await sendCustomCakeRequest({
      requestInput: {
        ...requestForCustomCakeInput,
        refPhoto: uploadedImage.data.customizeImage.image.url,
      },
    });

    return { status: "ok" };
  } else {
    await sendCustomCakeRequest({
      requestInput: {
        ...requestForCustomCakeInput,
        refPhoto: null,
      },
    });

    return {
      status: "ok",
    };
  }
};
