import ModalItem from '@/app/(public)/@modal/(.)dish/[slug]/ModalItem';
import Modal from '@/app/(public)/@modal/(.)dish/[slug]/modal';
import { DishParams } from '@/app/(public)/dish/[slug]/page';
import { getTranslations } from 'next-intl/server';

const DishInterceptor = async (props: DishParams) => {
  const t = await getTranslations('dish');
  return (
    <Modal title={t('detail.title')} dataTestId="popup-dish">
      <ModalItem params={props.params} />
    </Modal>
  );
};

export default DishInterceptor;
