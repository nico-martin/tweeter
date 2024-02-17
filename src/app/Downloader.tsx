import React from 'react';
import styles from './Downloader.module.css';
import cn from '@common/classnames';
import { Button, Progress } from '@theme';
import Model from '../webLLM/Model';
import { formatBytes, round } from '@common/functions';

const Downloader: React.FC<{
  className?: string;
  progress: number;
  loadModel: () => Promise<void>;
  modelSize: number;
}> = ({ className = '', progress, loadModel, modelSize }) => {
  const [downloading, setDownloading] = React.useState<boolean>(false);
  return (
    <div className={cn(className, styles.root)}>
      {downloading ? (
        <Progress
          value={progress}
          max={1}
          text={
            progress === 0
              ? 'Initializing...'
              : progress === 1
                ? 'preparing...'
                : `loading model (${round(progress * 100)}%)`
          }
        />
      ) : (
        <Button
          size="large"
          onClick={async () => {
            setDownloading(true);
            await loadModel();
            setDownloading(false);
          }}
        >
          Download Model
        </Button>
      )}
      <p className={styles.initializeDataWarning}>
        <i>
          This will download around <b>{formatBytes(modelSize)}</b> over the
          network. After the initial load, it will be cached in your browser.
        </i>
      </p>
    </div>
  );
};

export default Downloader;
