import Modal from '@/app/[locale]/(public)/@modal/(.)dish/[slug]/modal';
import DishDetail, {
  DishParams,
} from '@/app/[locale]/(public)/dish/[slug]/page';
import { getTranslations } from 'next-intl/server';

const DishInterceptor = async (props: DishParams) => {
  const t = await getTranslations('dish');
  return (
    <Modal title={t('detail.title')} dataTestId="popup-dish">
      <DishDetail params={props.params} />
    </Modal>
  );
};

export default DishInterceptor;
