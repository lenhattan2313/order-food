import "server-only";
import envConfig from "@/config";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: envConfig.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: envConfig.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: envConfig.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});
