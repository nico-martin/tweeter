import React from 'react';
import cn from '@common/classnames';
import styles from './CloseButton.module.css';

const CloseButton = React.forwardRef<
  HTMLButtonElement,
  {
    className?: string;
    onClick: Function;
  }
>(({ className = '', onClick }, ref) => (
  <button
    className={cn(styles.root, className)}
    onClick={() => onClick()}
    ref={ref}
  >
    close
  </button>
));

export default CloseButton;
