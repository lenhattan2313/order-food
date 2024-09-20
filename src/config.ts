import { z } from "zod";

const config = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
});

const configProject = config.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI:
    process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
});

if (!configProject.success) {
  throw new Error("Invalid ENV config");
}
const envConfig = configProject.data;
export default envConfig;
