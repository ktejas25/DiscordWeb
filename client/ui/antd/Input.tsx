import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, InputRef } from 'antd';
import { forwardRef } from 'react';

export interface InputProps extends AntInputProps {}

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  return <AntInput ref={ref} {...props} />;
});

Input.displayName = 'Input';
Input.Password = AntInput.Password;
Input.TextArea = AntInput.TextArea;
Input.Search = AntInput.Search;
