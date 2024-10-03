import "server-only";
import envConfig from "@/config";
import { S3Client } from "@aws-sdk/client-s3";
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
