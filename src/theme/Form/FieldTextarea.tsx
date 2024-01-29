import React from 'react';
import cn from '@common/classnames';
import inputStyles from './Input.module.css';
import { ChangeHandler } from 'react-hook-form';

interface Props {
  name: string;
  onChange?: ChangeHandler;
}

const FieldTextarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ name, onChange, ...props }, ref) => (
    <textarea
      ref={ref}
      name={name}
      className={cn(inputStyles.input)}
      id={name}
      onChange={onChange}
      {...props}
    />
  )
);

export default FieldTextarea;
