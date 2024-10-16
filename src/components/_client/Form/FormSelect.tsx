import { FormLabel } from '@/components/_client/Form';
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectProps } from '@radix-ui/react-select';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
export type IOption = {
  value: number | string;
  label: string;
};
type Props = SelectProps & {
  label: ReactNode;
  name: string;
  placeholder?: string;
  options: IOption[];
};

export const FormSelect = ({
  label,
  name,
  placeholder,
  options,
  ...selectProps
}: Props) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid gap-2">
            <FormLabel label={label} />
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              {...selectProps}
            >
              <FormControl>
                <SelectTrigger aria-label={name}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value as string}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
