import React from 'react';
import styles from './Main.module.css';
import useWebLLM from '../webLLM/useWebLLM';
import cn from '@common/classnames';
import Model from '../webLLM/Model';
import { GenerationState } from '../webLLM/static/types';
import { NotificationType, Notification } from '@theme';
import Tweeter from '@app/Tweeter';
import { isModelLoaded } from '@common/storage';
import hasModelInCache from '../webLLM/utils/hasModelInCache';
import Downloader from '@app/Downloader';

enum DOWNLOAD_STATE {
  EVALUATING = 'EVALUATING',
  NOT_DOWNLOADED = 'NOT_DOWNLOADED',
  DOWNLOADED = 'DOWNLOADED',
}

const Main: React.FC<{ model: Model; className?: string }> = ({
  className = '',
  model: selectedModel,
}) => {
  const [downloaded, setDownloaded] = React.useState<DOWNLOAD_STATE>(
    DOWNLOAD_STATE.EVALUATING
  );
  const {
    setModel,
    model,
    generationState,
    error,
    generate,
    answer,
    runtimeStats,
    loaderReport,
    initiate,
  } = useWebLLM();

  React.useEffect(() => {
    setModel(selectedModel);
    setDownloaded(DOWNLOAD_STATE.EVALUATING);
    hasModelInCache(selectedModel).then((cached) =>
      setDownloaded(
        cached ? DOWNLOAD_STATE.DOWNLOADED : DOWNLOAD_STATE.NOT_DOWNLOADED
      )
    );
  }, [selectedModel]);

  return (
    <main
      className={cn(styles.root, className)}
      data-generation-state={generationState}
    >
      {downloaded === DOWNLOAD_STATE.EVALUATING ? (
        <div />
      ) : downloaded === DOWNLOAD_STATE.NOT_DOWNLOADED ? (
        <Downloader
          className={styles.initialize}
          progress={loaderReport?.progress || 0}
          loadModel={async () => {
            await initiate();
            setDownloaded(DOWNLOAD_STATE.DOWNLOADED);
          }}
          modelSize={model.size}
        />
      ) : generationState === GenerationState.ERROR ? (
        <Notification type={NotificationType.ERROR}>
          An error occurred while loading the model:
          <br />
          {error}
        </Notification>
      ) : (
        <Tweeter
          generate={generate}
          answer={answer}
          generationState={generationState}
          stats={runtimeStats}
          model={model}
          loaderReport={loaderReport}
        />
      )}
    </main>
  );

  /*return (
    <main className={cn(styles.root, className)}>
      {!generatorInitialized ? null : modelLoaded ? (
        <Tweeter
          generate={generate}
          answer={answer}
          generationState={generationState}
          stats={stats}
          model={model}
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
  );*/
};

export default Main;
