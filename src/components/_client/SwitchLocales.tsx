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
import { usePathname, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';

export const SwitchLocales = () => {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Select
      onValueChange={(value) => {
        router.replace(pathname, {
          locale: value as Locale,
        });
      }}
      value={locale}
    >
      <SelectTrigger className="w-[120px]">
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
