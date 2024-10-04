import "server-only";
import envConfig from "@/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
const params = {
  region: envConfig.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: envConfig.NEXT_AWS_ACCESS_KEY_ID,
    secretAccessKey: envConfig.NEXT_AWS_SECRET_ACCESS_KEY,
  },
};
export const s3Client = new S3Client(params);
export const cloudFrontClient = new CloudFrontClient(params);
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  category = "dish"
) {
  const params = {
    Bucket: envConfig.NEXT_AWS_S3_BUCKET_NAME,
    Key: `${category}/${fileName}`,
    Body: file,
    ContentType: "image/jpg",
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}
