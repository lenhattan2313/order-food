import { FormLabel } from '@/components/_client/Form';
import { Input, InputProps } from '@/components/_client/Form/Input';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
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
              <Input {...inputProps} {...field} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
