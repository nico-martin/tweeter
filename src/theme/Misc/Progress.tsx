import React from 'react';
import cn from '@common/classnames';
import styles from './Progress.module.css';
const Progress: React.FC<{ value: number; max?: number; text?: string }> = ({
  value,
  max = 100,
  text = '',
}) => {
  const percentage = Math.round((value / max) * 100);
  return (
    <div className={cn(styles.root)}>
      <div className={cn(styles.progress)} style={{ width: `${percentage}%` }}>
        <span className={cn(styles.text, styles.textFront)}>{text}</span>
      </div>
      <span className={cn(styles.text, styles.textBack)}>{text}</span>
      <progress value={value} max={max} />
    </div>
  );
};

export default Progress;
