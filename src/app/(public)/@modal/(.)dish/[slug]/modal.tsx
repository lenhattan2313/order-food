'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';

const Modal = ({
  children,
  title,
  dataTestId,
}: PropsWithChildren<{ title: string; dataTestId: string }>) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(!value);
        router.back();
      }}
    >
      <DialogContent className="sm:max-w-[425px]" data-testid={dataTestId}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{children} </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
