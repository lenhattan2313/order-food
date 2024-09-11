"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DishStatus } from "@/constants/type";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";

type IOrderItem = {
  dish: DishResType["data"];
  onChange: (dishId: number, quantity: number) => void;
  quantity: number;
};
export default function MenuOrderItem({
  dish,
  onChange,
  quantity,
}: IOrderItem) {
  return (
    <div
      key={dish.id}
      className={cn("flex gap-4", {
        "pointer-events-none": dish.status === DishStatus.Unavailable,
      })}
    >
      <div className="flex-shrink-0 relative">
        {dish.status === DishStatus.Unavailable && (
          <span className="absolute inset-0 flex items-center justify-center text-sm">
            Hết hàng
          </span>
        )}
        <Image
          src={dish.image}
          alt={dish.name}
          height={100}
          width={100}
          quality={100}
          className="object-cover w-[80px] h-[80px] rounded-md"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm">{dish.name}</h3>
        <p className="text-xs">{dish.description}</p>
        <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
      </div>
      <div className="flex-shrink-0 ml-auto flex justify-center items-center">
        <div className="flex gap-1 ">
          <Button
            className="h-6 w-6 p-0"
            disabled={quantity === 0}
            onClick={() => onChange(dish.id, quantity - 1)}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            className="h-6 p-1 w-8 text-center"
            onChange={(e) => {
              const value = Number(e.target.value);
              if (isNaN(value)) {
                return;
              }
              onChange(dish.id, value);
            }}
            value={quantity}
          />
          <Button
            className="h-6 w-6 p-0"
            onClick={() => onChange(dish.id, quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
