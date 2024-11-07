import { dishActions } from '@/apiRequest/dish/dishActions';
import NoResult from '@/components/_client/NoResult';
import envConfig from '@/config';
import { htmlToTextForDesc, wrapServerApi } from '@/lib/serverUtils';
import { generateSlugUrl, getIdFromSlugUrl } from '@/lib/utils';
import { baseOpenGraph } from '@/shareMetadata';
import { Metadata } from 'next';
import Image from 'next/image';
import { cache } from 'react';
const getDetail = cache((id: number) =>
  wrapServerApi(() => dishActions.getDishDetail({ id })),
);
export type DishParams = { params: { slug: string } };

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const id = getIdFromSlugUrl(slug);
  const dish = await getDetail(id);
  if (!dish) {
    return {
      title: 'Không tìm thấy',
      description: 'Không tìm thấy',
    };
  }
  const { data } = dish;
  const url =
    envConfig.NEXT_PUBLIC_BASE_URL +
    `/dishes/${generateSlugUrl({
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

const DishDetail = async ({ params: { slug } }: DishParams) => {
  const id = getIdFromSlugUrl(slug);
  const response = await getDetail(id);
  if (!response) {
    return <NoResult />;
  }
  const data = response.data;
  return (
    <div className="flex gap-4 w flex-col items-center">
      <h2 role="heading">Dish detail</h2>
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
