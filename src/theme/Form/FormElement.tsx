import React from 'react';
import { RegisterOptions, useController } from 'react-hook-form';

import cn from '@common/classnames';

import styles from './FormElement.module.css';

const FormElement: React.FC<{
  className?: string;
  label?: string;
  instructions?: string | React.ReactNode;
  instructionsFull?: string | React.ReactNode;
  name: string;
  options?: RegisterOptions;
  Input: any;
  [key: string]: any;
}> = ({
  className = '',
  label = null,
  instructions = '',
  instructionsFull = '',
  name,
  options = {},
  Input,
  ...inputProps
}) => {
  const { field, formState } = useController({
    name,
    rules: options,
  });

  const error = formState.errors[name];

  return (
    <div
      className={cn(className, styles.root, {
        [styles.checkbox]: Input.displayName === 'FieldCheckbox',
      })}
    >
      {label && (
        <div className={styles.labelContainer}>
          <label htmlFor={name} id={`label-${name}`} className={styles.label}>
            {label}
            {'required' in options && '*'}
          </label>
          {Boolean(instructions) && (
            <p className={styles.instructions}>{instructions}</p>
          )}
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.inputContainer}>
          <Input {...inputProps} {...field} />
          {error && <p className={styles.error}>{error.message.toString()}</p>}
        </div>
        {Boolean(instructionsFull) && (
          <p className={styles.instructionsFull}>{instructionsFull}</p>
        )}
      </div>
    </div>
  );
};

export default FormElement;
