'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { type LucideIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface CommonDrawerProps {
  icon: LucideIcon;
  title: string;
  buttonText: string;
  buttonColor: string;
  children: ReactNode;
}

export function ServiceDrawer({
  icon: Icon,
  title,
  buttonText,
  buttonColor,
  children,
}: CommonDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={`flex flex-col items-center gap-2 h-auto p-4 rounded-lg`}
        >
          <div
            className={`w-10 h-10 ${buttonColor} rounded-sm flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-normal text-center">{buttonText}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">{title}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {children}
            <Button className={`w-full mt-6`} onClick={() => setOpen(false)}>
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
