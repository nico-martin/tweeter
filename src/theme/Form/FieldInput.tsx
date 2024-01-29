import React from 'react';
import cn from '@common/classnames';
import inputStyles from './Input.module.css';
import { ChangeHandler } from 'react-hook-form';

interface Props {
  name: string;
  onChange?: ChangeHandler;
  inputType?:
    | 'text'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'time'
    | 'url'
    | 'week';
}

const FieldInput = React.forwardRef<HTMLInputElement, Props>(
  ({ name, inputType = 'text', onChange, ...props }, ref) => (
    <input
      ref={ref}
      name={name}
      className={cn(inputStyles.input)}
      id={name}
      type={inputType}
      onChange={onChange}
      {...props}
    />
  )
);

export default FieldInput;
