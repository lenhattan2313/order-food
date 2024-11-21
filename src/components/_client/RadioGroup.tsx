import { Label } from '@/components/ui/label';
import {
  RadioGroup as RadioGroupShad,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { type LucideIcon } from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  icon?: LucideIcon;
  iconColor?: string;
}

interface CustomRadioGroupProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
}

export function RadioGroup({
  options,
  value,
  onValueChange,
}: CustomRadioGroupProps) {
  return (
    <RadioGroupShad
      value={value}
      onValueChange={onValueChange}
      className="grid gap-4"
    >
      {options.map((option) => (
        <Label
          key={option.id}
          htmlFor={option.id}
          className="flex items-center justify-between rounded-lg border-2 border-gray-200 bg-accent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
        >
          <div className="flex items-center gap-3">
            {option.icon && (
              <option.icon className={`h-5 w-5 text-${option.iconColor}`} />
            )}
            <div className="space-y-1">
              <p>{option.label}</p>
            </div>
          </div>
          <RadioGroupItem value={option.id} id={option.id} />
        </Label>
      ))}
    </RadioGroupShad>
  );
}
