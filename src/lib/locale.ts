import { defaultLocale } from '@/constants/locale';
import { Locale } from '@/interface/locale';
import { localStorageUtil } from '@/lib/storageUtils';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';

export function getUserLocale() {
  // return cookies().get(COOKIE_NAME)?.value || defaultLocale;
  return localStorageUtil.get(COOKIE_NAME) ?? defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  // cookies().set(COOKIE_NAME, locale);
  localStorageUtil.set(COOKIE_NAME, locale);
}
