import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import { forwardRef } from 'react';

export interface ButtonProps extends AntButtonProps {
  gradient?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ gradient = false, type = 'primary', className = '', ...props }, ref) => {
    const gradientClass = gradient && type === 'primary'
      ? 'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 border-0'
      : '';

    return (
      <AntButton
        ref={ref}
        type={type}
        className={`${gradientClass} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
