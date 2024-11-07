'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales } from '@/constants/locale';
import { Locale } from '@/interface/locale';
import { setUserLocale } from '@/lib/locale';
import { useLocale, useTranslations } from 'next-intl';

export const SwitchLocales = () => {
  const t = useTranslations('common');
  const locale = useLocale();
  return (
    <Select
      onValueChange={(value) => {
        setUserLocale(value as Locale);
      }}
      value={locale}
    >
      <SelectTrigger className="w-[120px]" aria-label="switch-locale">
        <SelectValue placeholder="Languages" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem value={locale} key={locale}>
            {t(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
