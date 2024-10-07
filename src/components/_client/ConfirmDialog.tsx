'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
type Props = {
  title: ReactNode;
  description: ReactNode;
  onClick: () => void;
  isPending: boolean;
};

export const ConfirmDialog = ({
  title,
  description,
  onClick,
  isPending,
}: Props) => {
  const t = useTranslations('button');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="cursor-pointer text-muted-foreground hover:text-foreground">
          {title}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onClick} disabled={isPending}>
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
