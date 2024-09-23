"use client";
import DishDetail from "@/app/(public)/dish/[id]/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { PropsWithChildren, Suspense, useState } from "react";

const Modal = ({ children }: PropsWithChildren) => {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dish detail</DialogTitle>
        </DialogHeader>
        <div>{children} </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
