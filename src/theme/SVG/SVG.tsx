import React from 'react';
import cn from '@common/classnames';
import styles from './SVG.module.css';
import icons, { IconName } from './icons';

const SVG: React.FC<{
  icon: IconName;
  className?: string;
  inline?: boolean;
  [key: string]: any;
  title?: string;
}> = ({ icon, className = '', inline = false, title = '', ...props }) => {
  const LoadedIcon = React.useMemo(
    () => (icon in icons ? icons[icon] : null),
    [icon]
  );

  return LoadedIcon ? (
    <figure
      className={cn(className, styles.root, {
        [styles.isInline]: inline,
      })}
      title={title}
      {...props}
    >
      <LoadedIcon />
    </figure>
  ) : null;
};

export default SVG;
