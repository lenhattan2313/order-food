import { FormLabel } from '@/components/ui/form';
import { ReactNode } from 'react';

type Props = {
  label: ReactNode;
  required?: boolean;
};

export const FormLabelComp = ({ label, required }: Props) => {
  return (
    <FormLabel>
      {label} {required && <span className="text-red-400">*</span>}
    </FormLabel>
  );
};
