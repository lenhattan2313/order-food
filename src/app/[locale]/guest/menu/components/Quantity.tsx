'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

type IQuantityProps = {
  onChange: (value: number) => void;
  value: number;
};
export default function Quantity({ onChange, value }: IQuantityProps) {
  return (
    <div className="flex gap-1 ">
      <Button
        className="h-6 w-6 p-0"
        disabled={value === 0}
        onClick={() => onChange(value - 1)}
        aria-label="minus"
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
          onChange(value);
        }}
        value={value}
        aria-label="quantity"
      />

      <Button
        className="h-6 w-6 p-0"
        onClick={() => onChange(value + 1)}
        aria-label="plus"
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}
