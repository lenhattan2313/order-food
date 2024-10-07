import { defaultLocale, locales } from '@/constants/locale';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales,
  defaultLocale,
});
