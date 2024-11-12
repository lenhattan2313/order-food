import { dishActions } from '@/apiRequest/dish/dishActions';
import DishItemComp from '@/app/(public)/dish/DishItem';
import NoResult from '@/components/_client/NoResult';

const DishMain = async () => {
  const { data = [] } = await dishActions.getList();

  return (
    <section className="space-y-10 py-16" data-testid="card-dish">
      <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <DishItemComp key={index} dish={item} />
        ))}
        {data.length === 0 && <NoResult />}
      </div>
    </section>
  );
};

export default DishMain;