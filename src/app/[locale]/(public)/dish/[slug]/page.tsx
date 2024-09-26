import { dishActions } from "@/actions/dish/dishActions";
import { wrapServerApi } from "@/lib/serverUtils";
import { generateSlugUrl, getIdFromSlugUrl } from "@/lib/utils";
import { unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
export type DishParams = { params: { slug: string; locale: string } };
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
  const response = await wrapServerApi(() => dishActions.getDishDetail({ id }));
  if (!response) {
    return <h1>No data</h1>;
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
      <p>{data.name}</p>
    </div>
  );
};

export default DishDetail;
