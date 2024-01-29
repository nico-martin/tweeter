import React from 'react';
import cn from '@common/classnames';
import styles from './Icon.module.css';
import SVG from './SVG';
import { IconName } from './icons';

const Icon: React.FC<{
  icon: IconName;
  className?: string;
  rotate?: 90 | 180 | 270 | false;
  spinning?: boolean;
  button?: boolean;
  round?: boolean;
  circle?: boolean;
  inline?: boolean;
  title?: string;
  [key: string]: any;
}> = ({
  icon,
  className = '',
  spinning = false,
  rotate = false,
  button = false,
  round = false,
  circle = false,
  inline = false,
  title,
  ...props
}) => {
  return icon ? (
    <span
      className={cn(styles.icon, className, {
        [styles.isInline]: inline,
        [styles[`rotate-${rotate}`]]: rotate !== false,
        [styles.animationSpin]: spinning,
        [styles.isRound]: round,
        [styles.circle]: circle,
      })}
      {...props}
    >
      <SVG icon={icon} title={title} />
    </span>
  ) : null;
};

export default Icon;
