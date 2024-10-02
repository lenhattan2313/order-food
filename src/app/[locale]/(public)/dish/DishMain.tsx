import { dishActions } from "@/apiRequest/dish/dishActions";
import DishItemComp from "@/app/[locale]/(public)/dish/DishItem";
type Props = {};

const DishMain = async (props: Props) => {
  const { data = [] } = await dishActions.getList();

  return (
    <section className="space-y-10 py-16">
      <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {data.map((item, index) => (
          <DishItemComp key={index} dish={item} />
        ))}
      </div>
    </section>
  );
};

export default DishMain;