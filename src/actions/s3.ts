"use server";
import envConfig from "@/config";
import { s3Client } from "@/lib/s3Utils";
import { generateFileName } from "@/lib/serverUtils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/quicktime",
];

const maxFileSize = 1024 * 1024; // 1 MB
type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};
export async function getSignedURL({
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams) {
  // first just make sure in our code that we're only allowing the file types we want
  if (!allowedFileTypes.includes(fileType)) {
    return { failure: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { failure: "File size too large" };
  }
  const fileName = generateFileName();
  const putObjectCommand = new PutObjectCommand({
    Bucket: envConfig.NEXT_AWS_S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );

  return { success: { url, fileName }, message: "Create new pre signer URL" };
}
