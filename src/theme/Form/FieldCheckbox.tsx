import React from 'react';
import cn from '@common/classnames';
import styles from './FieldCheckbox.module.css';

const FieldCheckbox: React.FC<{
  className?: string;
  value: boolean;
  label: string;
  onChange: Function;
  name: string;
  id: string;
  disabled: boolean;
}> = ({
  className = '',
  value = false,
  label,
  onChange,
  name,
  id,
  disabled,
}) => (
  <div className={cn(className, styles.root)}>
    <input
      type="checkbox"
      onChange={(e) => onChange(e)}
      name={name}
      id={id}
      className={styles.input}
      checked={value}
      disabled={disabled}
    />
    <span
      className={styles.checkbox}
      onClick={() => !disabled && onChange(!value)}
    />
  </div>
);

FieldCheckbox.displayName = 'FieldCheckbox';

export default FieldCheckbox;
