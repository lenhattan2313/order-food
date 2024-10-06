import { dishActions } from "@/apiRequest/dish/dishActions";
import envConfig from "@/config";
import { Locale } from "@/interface/locale";
import { htmlToTextForDesc, wrapServerApi } from "@/lib/serverUtils";
import { generateSlugUrl, getIdFromSlugUrl } from "@/lib/utils";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { baseOpenGraph } from "@/shareMetadata";
import { cache } from "react";
import NoResult from "@/components/_client/NoResult";
const getDetail = cache((id: number) =>
  wrapServerApi(() => dishActions.getDishDetail({ id }))
);
export type DishParams = { params: { slug: string; locale: string } };

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations("common");
  const id = getIdFromSlugUrl(slug);
  const dish = await getDetail(id);
  if (!dish) {
    return {
      title: t("notFound"),
      description: t("notFound"),
    };
  }
  const { data } = dish;
  const url =
    envConfig.NEXT_PUBLIC_BASE_URL +
    `/${locale}/dishes/${generateSlugUrl({
      name: data.name,
      id: data.id,
    })}`;
  return {
    title: data.name,
    description: htmlToTextForDesc(data.description),
    openGraph: {
      ...baseOpenGraph,
      title: data.name,
      description: data.description,
      url,
      images: [
        {
          url: data.image,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}
export async function generateStaticParams() {
  const dish = await wrapServerApi(() => dishActions.getList());
  return (
    dish?.data.map(({ name, id }) => ({
      slug: generateSlugUrl({ name, id }),
    })) ?? []
  );
}

const DishDetail = async ({ params: { slug, locale } }: DishParams) => {
  unstable_setRequestLocale(locale);
  const id = getIdFromSlugUrl(slug);
  const response = await getDetail(id);
  if (!response) {
    return <NoResult />;
  }
  const data = response.data;
  return (
    <div className="flex gap-4 w flex-col items-center">
      <div className="flex-shrink-0">
        <Image
          width={300}
          height={300}
          src={data.image}
          alt={data.name}
          className="object-cover w-[300px] h-[300px] rounded-md"
        />
      </div>
      <p className="font-bold">{data.name}</p>
      <p className="text-sm leading-relaxed">{data.description}</p>
    </div>
  );
};

export default DishDetail;
