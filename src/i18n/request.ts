import { getUserLocale } from '@/lib/locale';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Validate that the incoming `locale` parameter is valid
  const locale = getUserLocale();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
