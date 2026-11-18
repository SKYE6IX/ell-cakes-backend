// @ts-expect-error Upload.mjs was exported from the type
import Upload from "graphql-upload/Upload.js";
import sharp from "sharp";
import heicConvert from "heic-convert";
import { Readable } from "stream";
import { streamToBuffer } from "./streamToBuffer";

export async function processUploadImages(resolveFile: Upload) {
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
