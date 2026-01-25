// @ts-expect-error Upload.mjs was exported from the type
import Upload from "graphql-upload/Upload.js";
import sharp from "sharp";
import heicConvert from "heic-convert";
import { Readable } from "stream";
import { Context } from ".keystone/types";

export const uploadImageCustomization = async (
  root: any,
  { files }: { files: Upload[] },
  context: Context
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

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));
  });
}

async function processUploadImages(resolveFile: Upload) {
  const stream = resolveFile.createReadStream() as NodeJS.ReadableStream;

  const buffer = await streamToBuffer(stream);
  const mimeType = (await sharp(buffer).metadata()).format;

  if (mimeType === "heif") {
    const convertedFile = await heicConvert({
      buffer: buffer as unknown as ArrayBufferLike,
      format: "JPEG",
      quality: 0.85,
    });

    const convertedBuffer = Buffer.from(convertedFile);

    return {
      createReadStream: () => Readable.from(convertedBuffer),
      filename: resolveFile.filename,
      mimetype: `image/jpeg`,
      encoding: "7bit",
    };
  } else {
    return {
      createReadStream: () => resolveFile.createReadStream(),
      filename: resolveFile.filename,
      mimetype: `image/${mimeType}`,
      encoding: "7bit",
    };
  }
}
