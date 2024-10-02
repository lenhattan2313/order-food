// export const revalidate = 3600; // one hour

import { dishActions } from "@/apiRequest/dish/dishActions";
import { generateSlugUrl } from "@/lib/utils";

export async function generateSitemaps() {
  //call DB or API
  const dish = await dishActions.getList();

  // Calculate the number of sitemaps needed (3 products per sitemap)
  const productsPerSitemap = 2;
  const numberOfSitemaps = Math.ceil(dish.data.length / productsPerSitemap);

  // Generate an array of sitemap objects
  const sitemaps = Array.from({ length: numberOfSitemaps }, (_, index) => ({
    id: index,
  }));

  return sitemaps;
}

export default async function sitemap({ id }: { id: number }) {
  //   const start = id * 5000;
  //   const limit = 5000;

  //TODO pagination this API
  //call DB or API
  const dish = await dishActions.getList();

  const product = dish.data.map((item) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/dish/${generateSlugUrl({
      name: item.name,
      id: item.id,
    })}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...product];
}
