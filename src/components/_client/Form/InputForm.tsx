import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = InputProps & {
  label: ReactNode;
  name: string;
};

export const InputForm = ({ label, name, ...inputProps }: Props) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input {...field} {...inputProps} />
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
