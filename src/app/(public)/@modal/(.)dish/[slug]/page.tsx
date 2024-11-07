import ModalItem from '@/app/(public)/@modal/(.)dish/[slug]/ModalItem';
import Modal from '@/app/(public)/@modal/(.)dish/[slug]/modal';
import { DishParams } from '@/app/(public)/dish/[slug]/page';

const DishInterceptor = async (props: DishParams) => {
  return (
    <Modal title="Món ăn" dataTestId="popup-dish">
      <ModalItem params={props.params} />
    </Modal>
  );
};

export default DishInterceptor;
