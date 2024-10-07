import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { isClient } from '@/lib/utils';

export const localStorageUtil = {
  get(key: string): string | null {
    if (!isClient) return null;
    return localStorage.getItem(key);
  },

  set(key: string, value: string): void {
    if (!isClient) return;
    localStorage.setItem(key, value);
  },

  remove(key: string): void {
    if (!isClient) return;
    localStorage.removeItem(key);
  },
};
export const clearTokenFromLocalStorage = () => {
  localStorageUtil.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  localStorageUtil.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
};
