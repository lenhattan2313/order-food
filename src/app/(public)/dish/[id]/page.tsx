import { dishActions } from "@/actions/dish/dishActions";
import { Spinner } from "@/components/_client/Spinner";
import { wrapServerApi } from "@/lib/serverUtils";
import Image from "next/image";

const DishDetail = async ({ params: { id } }: { params: { id: number } }) => {
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
