import React from 'react';
import styles from './Main.module.css';
import useWebLLM from '../webLLM/useWebLLM';
import { Button, Notification, Progress } from '@theme';
import { formatBytes, round } from '@common/functions';
import { NotificationType } from '../theme/Misc/Notification';
import Tweeter from '@app/Tweeter';
import cn from '@common/classnames';
import Model from '../webLLM/Model';

const Main: React.FC<{ model: Model; className?: string }> = ({
  model,
  className = '',
}) => {
  const {
    modelLoaded,
    modelLoading,
    modelCached,
    generatorInitialized,
    report,
    error,
    loadModel,
    generationState,
    generate,
    answer,
  } = useWebLLM(model);
  const progress = report?.progress || 0;

  return (
    <main className={cn(styles.root, className)}>
      {!generatorInitialized ? null : modelLoaded ? (
        <Tweeter
          generate={generate}
          answer={answer}
          generationState={generationState}
        />
      ) : error ? (
        <Notification type={NotificationType.ERROR}>
          An error occurred while loading the model:
          <br />
          {error}
        </Notification>
      ) : (
        <div className={styles.initialize}>
          {!modelLoading ? (
            <Button size="large" onClick={() => loadModel()}>
              {modelCached ? 'Initialize Model' : 'Download Model'}
            </Button>
          ) : (
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
          )}
          {modelCached ? (
            <p className={styles.initializeDataWarning}>
              <i>
                The model is already cached.
                <br />
                So it wont take too long.
              </i>
            </p>
          ) : (
            <p className={styles.initializeDataWarning}>
              <i>
                This will download around <b>{formatBytes(model.size)}</b> over
                the network. After the initial load, it will be cached in your
                browser.
              </i>
            </p>
          )}
        </div>
      )}
    </main>
  );
};

export default Main;
