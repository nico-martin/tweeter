import React from 'react';
import { Button, ButtonGroup } from '../index';
import styles from './FormControls.module.css';

interface Props {
  value?: string;
  className?: string;
  align?: 'right' | 'left' | 'center';
  loading?: boolean;
  resetText?: string;
  resetFunction?: () => void;
  [key: string]: any;
}

const FormControls = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(
  (
    {
      value = 'Submit',
      className = '',
      align = 'left',
      loading = false,
      resetText = 'Reset',
      resetFunction = null,
      ...buttonProps
    },
    ref
  ) => (
    <ButtonGroup align={align} className={styles.controls}>
      {resetFunction && align === 'right' && (
        <Button onClick={resetFunction} appearance="none" type="button">
          {resetText}
        </Button>
      )}
      <Button {...buttonProps} loading={loading} type="submit" ref={ref}>
        {value}
      </Button>
      {resetFunction && align !== 'right' && (
        <Button onClick={resetFunction} appearance="none" type="button">
          {resetText}
        </Button>
      )}
    </ButtonGroup>
  )
);

export default FormControls;
