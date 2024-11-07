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
              <Button>Huỷ</Button>
            </DialogClose>
          )}
          {footer}
        </DialogFooter>
      </DialogContent>
    </DialogShad>
  );
};
