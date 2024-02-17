import React from 'react';
import cn from '@common/classnames';
import styles from './Tweeter.module.css';
import PromptForm from '@app/PromptForm';
import { Button, Copy, Modal, ShadowBox } from '@theme';
import {
  GenerationState,
  InitProgressCallbackReport,
  RuntimeStats,
} from '../webLLM/static/types';
import { round } from '@common/functions';
import Model from '../webLLM/Model';
import * as tvmjs from '@nico-martin/tvmjs';
import ShareBenchmarkResults from '@app/ShareBenchmarkResults';

const Tweeter: React.FC<{
  generate: (
    prompt: string,
    rememberPreviousConversation?: boolean
  ) => Promise<string>;
  answer: string;
  generationState: GenerationState;
  stats: RuntimeStats;
  model: Model;
  loaderReport: InitProgressCallbackReport;
}> = ({ generate, answer, generationState, stats, model, loaderReport }) => {
  const [benchmarkTestModal, setBenchmarkTestModal] =
    React.useState<boolean>(false);
  const [shareResultsModal, setShareResultsModal] =
    React.useState<boolean>(true);
  const answerWithoutQuotes = answer.replace(/"/g, '');
  const [gpuAdapterInfo, setGpuAdapterInfo] =
    React.useState<GPUAdapterInfo>(null);
  const [isBenchmarkTest, setIsBenchmarkTest] = React.useState<boolean>(false);

  React.useEffect(() => {
    tvmjs
      .detectGPUDevice()
      .then((adapter) => setGpuAdapterInfo(adapter.adapterInfo));
  }, []);

  return (
    <React.Fragment>
      <div className={cn(styles.root)}>
        <PromptForm
          disabled={generationState !== GenerationState.IDLE}
          generate={generate}
          benchmarkTest={isBenchmarkTest}
          setBenchmarkTest={setIsBenchmarkTest}
          setShareResultsModal={setShareResultsModal}
        />
        {(answerWithoutQuotes !== '' || GenerationState.THINKING) && (
          <p className={styles.answer}>
            {generationState === GenerationState.INITIALIZING
              ? `initializing (${round(loaderReport.progress * 100)}%)`
              : generationState === GenerationState.THINKING
                ? 'thinking...'
                : answerWithoutQuotes}
          </p>
        )}
        <div className={styles.footer}>
          <div className={styles.stats}>
            {stats && (
              <React.Fragment>
                <p>
                  <b>Runtime</b>
                  <br />
                  Input:{' '}
                  {stats.prefillTotalTokens ? (
                    <span>
                      {stats.prefillTotalTokens} Tokens (
                      {round(stats.prefillTokensPerSec, 2)} tokens/sec)
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                  <br />
                  Output:{' '}
                  {stats.decodingTotalTokens ? (
                    <span>
                      {stats.decodingTotalTokens} Tokens (
                      {round(stats.decodingTokensPerSec, 2)} tokens/sec)
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </p>
                <p>
                  <b>GPU:</b>{' '}
                  {gpuAdapterInfo
                    ? `${gpuAdapterInfo.description ? gpuAdapterInfo.description : gpuAdapterInfo.vendor} (${gpuAdapterInfo.architecture})`
                    : '-'}
                </p>
                <p>
                  <b>Model:</b>{' '}
                  <a href={model.url.replace('/resolve/main', '')}>
                    {model.title}
                  </a>
                </p>
              </React.Fragment>
            )}
          </div>
          {answerWithoutQuotes !== '' &&
            generationState === GenerationState.COMPLETE && (
              <div className={styles.copy}>
                <Copy content={answerWithoutQuotes} />
              </div>
            )}
        </div>
      </div>
      {benchmarkTestModal && (
        <Modal
          close={() => setBenchmarkTestModal(false)}
          size="small"
          title="Benchmark test"
        >
          <div className={styles.benchmarkTestsModal}>
            <p>
              This test is used to test LLMs in the browser on different end
              devices. It is not a standardised test in laboratory environments,
              but serves as a snapshot of how users can interact with LLMs
            </p>
            <p>
              All results will be published here:
              <br />
              <a
                href="https://docs.google.com/spreadsheets/d/1EjMsyMW82ud3E81-Cpp_rRd2YXoqvano-K3kX_yM-rE/edit?usp=sharing"
                target="_blank"
              >
                WebLLM in the wild
              </a>
            </p>
            <Button
              onClick={() => {
                setIsBenchmarkTest(true);
                setBenchmarkTestModal(false);
              }}
              className={styles.benchmarkTestsModalButton}
            >
              Run test
            </Button>
          </div>
        </Modal>
      )}
      {shareResultsModal && (
        <ShareBenchmarkResults
          stats={stats}
          close={() => setShareResultsModal(false)}
          gpuAdapterInfo={gpuAdapterInfo}
        />
      )}
      <button
        className={styles.benchmarkTests}
        onClick={() => setBenchmarkTestModal(true)}
      >
        benchmark test
      </button>
    </React.Fragment>
  );
};

export default Tweeter;
