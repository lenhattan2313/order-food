import { IDialogProps } from '@/components/_client/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  Dialog as DialogShad,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { FC, ReactNode } from 'react';

type Props = IDialogProps & {
  footer?: ReactNode[];
};
export const Dialog: FC<Props> = ({
  title,
  description,
  onOpenChange,
  open,
  footer = [],
}) => {
  const t = useTranslations('button');
  return (
    <DialogShad open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {!Boolean(footer.length) && (
            <DialogClose>
              <Button>{t('cancel')}</Button>
            </DialogClose>
          )}
          {footer}
        </DialogFooter>
      </DialogContent>
    </DialogShad>
  );
};
