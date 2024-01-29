import React from 'react';
import cn from '@common/classnames';
import { Icon, Loader } from '../index';
import styles from './Button.module.css';
import { IconName } from '../SVG/icons';

const Button: React.FC<{
  children?: React.JSX.Element | React.JSX.Element[] | string;
  className?: string;
  onClick?: () => void;
  layout?: 'solid' | 'empty' | 'outline';
  round?: boolean;
  icon?: IconName;
  iconRight?: boolean;
  iconCircle?: boolean;
  loading?: boolean;
  disabled?: boolean;
  color?: 'black' | 'primary';
  onlyIconMobile?: boolean;
  size?: 'small' | 'medium' | 'large';
  [key: string]: any;
}> = ({
  children = '',
  className = '',
  onClick = () => {},
  layout = 'solid',
  round = false,
  icon = null,
  iconRight = false,
  iconCircle = false,
  loading = false,
  disabled = false,
  color = 'black',
  onlyIconMobile = false,
  size = 'medium',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        className,
        styles.button,
        `button--color-${color}`,
        styles[`button--size-${size}`],
        {
          [styles.buttonLayoutEmpty]: layout === 'empty',
          [styles.buttonLayoutOutline]: layout === 'outline',
          [styles.buttonIsRound]: round,
          [styles.buttonIsDisabled]: disabled,
          [styles.buttonIsLoading]: loading,
          [styles.buttonHasNoText]: children === '',
          [styles.buttonColorPrimary]: color === 'primary',
          [styles.buttonOnlyIconMobile]: onlyIconMobile,
          [styles.buttonHasIcon]: Boolean(icon),
        }
      )}
      onClick={() => onClick()}
    >
      <div className={styles.bkg} />
      <Loader className={styles.loader} />
      {Boolean(icon) && !iconRight && (
        <Icon
          className={cn(styles.icon, styles.iconLeft)}
          icon={icon}
          circle={iconCircle}
        />
      )}
      <span className={styles.content}>{children}</span>
      {Boolean(icon) && iconRight && (
        <Icon
          className={cn(styles.icon, styles.iconRight)}
          icon={icon}
          circle={iconCircle}
        />
      )}
    </button>
  );
};

export default Button;
