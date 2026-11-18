// @ts-expect-error Upload.mjs was exported from the type
import Upload from "graphql-upload/Upload.js";
import { Context } from ".keystone/types";
import { processUploadImages } from "../utils/processCustomUploadImage";

export const uploadImageCustomization = async (
  root: any,
  { files }: { files: Upload[] },
  context: Context,
) => {
  const sudoContext = context.sudo();
  const newImagesId: string[] = [];

  for (const file of files) {
    const resolveFile = await file;

    const imageData = await processUploadImages(resolveFile);

    const upload = new Upload();

    upload.resolve(imageData);

    const newImage = await sudoContext.query.CustomizeImage.createOne({
      data: {
        image: { upload: upload },
        altText: imageData.filename,
      },
    });
    newImagesId.push(newImage.id);
  }

  return await sudoContext.db.CustomizeImage.findMany({
    where: {
      id: { in: newImagesId },
    },
  });
};
