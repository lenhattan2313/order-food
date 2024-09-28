import envConfig from "@/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${envConfig.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
