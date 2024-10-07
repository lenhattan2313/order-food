import type en from '../../messages/en.json';

export type IPaginationParams = {
  page: number;
  pageSize: number;
};

export type TopLevelKeys<
  Translations extends object,
  Namespace extends keyof Translations,
> = keyof Translations[Namespace];
export type MenuTranslationKeys = TopLevelKeys<typeof en, 'menu'>;
