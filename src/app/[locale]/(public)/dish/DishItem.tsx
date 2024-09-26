"use client";
import { DishItem } from "@/context/dishContext";
import { formatCurrency } from "@/lib/currency";
import { useRouter } from "@/navigation";
import Image from "next/image";
import React from "react";

type Props = {
  dish: DishItem;
};

const DishItemComp = ({ dish }: Props) => {
  const router = useRouter();
  function handleOpenDetail() {
    router.push(`/dish/${dish.id}`);
  }
  return (
    <div className="flex gap-4 w">
      <div className="flex-shrink-0">
        <Image
          width={150}
          height={150}
          src={dish.image}
          alt={dish.name}
          className="object-cover w-[150px] h-[150px] rounded-md"
          onClick={handleOpenDetail}
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{dish.name}</h3>
        <p className="">{dish.description}</p>
        <p className="font-semibold">{formatCurrency(dish.price)}</p>
      </div>
    </div>
  );
};

export default DishItemComp;
