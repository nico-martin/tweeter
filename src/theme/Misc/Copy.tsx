import React from 'react';
import styles from './Copy.module.css';
import Icon from '../SVG/Icon';
import { IconName } from '../SVG/icons';
import cn from '@common/classnames';
import {
  removeLeadingQuotationMarks,
  removeTrailingQuotationMarks,
} from '@common/functions';

const Copy = ({
  className = '',
  content = '',
}: {
  className?: string;
  content?: string;
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  const doCopy = () => {
    navigator.clipboard.writeText(
      removeLeadingQuotationMarks(removeTrailingQuotationMarks(content))
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      className={cn(className, styles.button)}
      onClick={doCopy}
      type="button"
    >
      <Icon
        className={cn(styles.icon, { [styles.iconCopied]: copied })}
        icon={copied ? IconName.CHECK : IconName.CONTENT_COPY}
      />
      <span className={styles.content}>
        {copied ? 'copied!' : 'copy to clipboard'}
      </span>
    </button>
  );
};

export default Copy;
