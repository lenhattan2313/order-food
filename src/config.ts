import { z } from 'zod';

const config = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
  NEXT_AWS_REGION: z.string(),
  NEXT_AWS_ACCESS_KEY_ID: z.string(),
  NEXT_AWS_SECRET_ACCESS_KEY: z.string(),
  NEXT_AWS_S3_BUCKET_NAME: z.string(),
  NEXT_PUBLIC_AWS_S3_IMAGE_SOURCE: z.string(),
  NEXT_CLOUDFRONT_KEYPAIR_ID: z.string(),
  NEXT_CLOUDFRONT_PRIVATE_KEY: z.string(),
});

const configProject = config.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI:
    process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI ?? '',
  NEXT_PUBLIC_AWS_S3_IMAGE_SOURCE:
    process.env.NEXT_PUBLIC_AWS_S3_IMAGE_SOURCE ?? '',

  //server side
  NEXT_AWS_REGION: process.env.NEXT_AWS_REGION ?? '',
  NEXT_AWS_ACCESS_KEY_ID: process.env.NEXT_AWS_ACCESS_KEY_ID ?? '',
  NEXT_AWS_SECRET_ACCESS_KEY: process.env.NEXT_AWS_SECRET_ACCESS_KEY ?? '',
  NEXT_AWS_S3_BUCKET_NAME: process.env.NEXT_AWS_S3_BUCKET_NAME ?? '',
  NEXT_CLOUDFRONT_KEYPAIR_ID: process.env.NEXT_CLOUDFRONT_KEYPAIR_ID ?? '',
  NEXT_CLOUDFRONT_PRIVATE_KEY: process.env.NEXT_CLOUDFRONT_PRIVATE_KEY ?? '',
});

if (!configProject.success) {
  throw new Error('Invalid ENV config');
}
const envConfig = configProject.data;
export default envConfig;
