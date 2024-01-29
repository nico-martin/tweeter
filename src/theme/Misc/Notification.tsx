import React from 'react';

import cn from '@common/classnames';

import styles from './Notification.module.css';

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

const Notification: React.FC<{
  className?: string;
  type?: NotificationType;
  children: any;
}> = ({ className = '', type = NotificationType.MESSAGE, children }) => (
  <div
    className={cn(className, styles.root, {
      [styles.typeError]: type === NotificationType.ERROR,
      [styles.typeSuccess]: type === NotificationType.SUCCESS,
    })}
  >
    <p className={styles.text}>{children}</p>
  </div>
);

export default Notification;
