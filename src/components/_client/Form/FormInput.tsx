import { FormLabel } from '@/components/_client/Form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = InputProps & {
  label: ReactNode;
  name: string;
};

export const FormInput = ({ label, name, id, ...inputProps }: Props) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid gap-2">
            <FormLabel label={label} required={inputProps.required} />
            <FormControl>
              <Input {...field} {...inputProps} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
