import React from 'react';
import { Input as InputShad } from '@/components/ui/input';
import { type LucideIcon } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, iconPosition = 'left', className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <InputShad
          ref={ref}
          className={`${iconPosition === 'left' ? 'pl-10' : 'pr-10'} ${className} placeholder:text-sm`}
          {...props}
        />
        {Icon && (
          <Icon
            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5
            ${iconPosition === 'left' ? 'left-3' : 'right-3'}`}
          />
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
