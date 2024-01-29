import React from 'react';
import cn from '@common/classnames';
import styles from './Form.module.css';

const Form = React.forwardRef<
  HTMLFormElement,
  {
    className?: string;
    children?: React.ReactElement | React.ReactElement[] | any;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
  }
>(({ className = '', children, onSubmit = () => {} }, ref) => (
  <form
    className={cn(className, styles.form)}
    onSubmit={(data) => onSubmit(data)}
    ref={ref}
  >
    {children}
  </form>
));

export default Form;
