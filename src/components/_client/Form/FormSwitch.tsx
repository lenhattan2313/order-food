import { FormLabel } from '@/components/_client/Form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  label: ReactNode;
  name: string;
};

export const FormSwitch = ({ label, name }: Props) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-4 items-center justify-items-start gap-4">
            <FormLabel label={label} />
            <div className="col-span-3 w-full space-y-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
