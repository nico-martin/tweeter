import React from 'react';
import styles from './Main.module.css';
import useWebLLM, { ChatState, Model, MODELS } from '../webLLM/useWebLLM';
import { Button, Notification, Progress } from '@theme';
import { isModelLoaded } from '@common/storage';
import { formatBytes, round } from '@common/functions';
import { NotificationType } from '../theme/Misc/Notification';
import Tweeter from '@app/Tweeter';
import cn from '@common/classnames';

const Main: React.FC<{ model: Model; className?: string }> = ({
  model,
  className = '',
}) => {
  const { state, init, activeReport, generate, answer, generationState } =
    useWebLLM(model);
  const progress = activeReport?.progress || 0;

  return (
    <main className={cn(styles.root, className)}>
      {state === ChatState.IDLE || state === ChatState.INITIALIZING ? (
        <div className={styles.initialize}>
          {state === ChatState.IDLE ? (
            <Button size="large" onClick={() => init()}>
              {isModelLoaded(model) ? 'Initialize Model' : 'Download Model'}
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
          {isModelLoaded(model) ? (
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
                This will download around{' '}
                <b>{formatBytes(MODELS[model].size)}</b> over the network. After
                the initial load, it will be cached in your browser.
              </i>
            </p>
          )}
        </div>
      ) : state === ChatState.ERROR ? (
        <Notification type={NotificationType.ERROR}>
          An error occurred while loading the model
        </Notification>
      ) : (
        <Tweeter
          generate={generate}
          answer={answer}
          generationState={generationState}
        />
      )}
    </main>
  );
};

export default Main;
