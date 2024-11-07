import { dishActions } from '@/apiRequest/dish/dishActions';
import envConfig from '@/config';
import { generateSlugUrl } from '@/lib/utils';
import { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';
export type Sitemap = Array<{
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  alternates?: {
    languages?: Languages<string>;
  };
}>;
//only for public page
const staticRoutes: Sitemap = [
  {
    url: '/login',
    changeFrequency: 'yearly',
    priority: 0.5,
  },
  {
    url: '',
    changeFrequency: 'daily',
    priority: 1,
  },
];
export default async function sitemap(): Promise<Sitemap> {
  // not able to use alternates props
  //   const staticSitemap = staticRoutes.map((route) => ({
  //     ...route,
  //     url: `${envConfig.NEXT_PUBLIC_BASE_URL}/${route.url}`,
  //     lastModified: new Date(),
  //     alternates: {
  //       languages: {
  //         en: `${envConfig.NEXT_PUBLIC_BASE_URL}/${route.url}/en`,
  //         vi: `${envConfig.NEXT_PUBLIC_BASE_URL}/${route.url}/vi`,
  //       },
  //     },
  //   }));
  const staticSitemap = staticRoutes.map((route) => ({
    ...route,
    url: `${envConfig.NEXT_PUBLIC_BASE_URL}${route.url}`,
    lastModified: new Date(),
  }));

  const dish = await dishActions.getList();
  if (dish) {
    const dynamicDishes: Sitemap = dish.data.map((item) => ({
      url: `${envConfig.NEXT_PUBLIC_BASE_URL}/${generateSlugUrl({
        name: item.name,
        id: item.id,
      })}`,
      lastModified: item.updatedAt,
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    return [...staticSitemap, ...dynamicDishes];
  }
  return [...staticSitemap];
}
