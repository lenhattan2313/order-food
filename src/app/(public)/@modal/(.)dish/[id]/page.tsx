import Modal from "@/app/(public)/@modal/(.)dish/[id]/modal";
import DishDetail from "@/app/(public)/dish/[id]/page";
type Props = {
  params: { id: number };
};

const DishInterceptor = (props: Props) => {
  return (
    <Modal>
      <DishDetail params={props.params} />
    </Modal>
  );
};

export default DishInterceptor;
