import Modal from "@/app/[locale]/(public)/@modal/(.)dish/[slug]/modal";
import DishDetail, {
  DishParams,
} from "@/app/[locale]/(public)/dish/[slug]/page";

const DishInterceptor = (props: DishParams) => {
  return (
    <Modal>
      <DishDetail params={props.params} />
    </Modal>
  );
};

export default DishInterceptor;
