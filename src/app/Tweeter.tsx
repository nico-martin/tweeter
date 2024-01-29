import React from 'react';
import cn from '@common/classnames';
import styles from './Tweeter.module.css';
import PromptForm from '@app/PromptForm';
import { Copy } from '@theme';
import {
  FullStats,
  GenerationState,
  RuntimeStats,
} from '../webLLM/static/types';
import { round } from '@common/functions';
import Model from '../webLLM/Model';

const Tweeter: React.FC<{
  generate: (
    prompt: string,
    rememberPreviousConversation?: boolean
  ) => Promise<string>;
  answer: string;
  generationState: GenerationState;
  stats: FullStats;
  model: Model;
}> = ({ generate, answer, generationState, stats, model }) => {
  const [prompt, setPrompt] = React.useState<string>('');
  const [activePrompt, setActivePrompt] = React.useState<string>('');

  React.useEffect(() => {
    if (prompt && prompt !== activePrompt) {
      setActivePrompt(prompt);
      generate(prompt, false);
    }
  }, [prompt]);

  const answerWithoutQuotes = answer.replace(/"/g, '');

  return (
    <div className={cn(styles.root)}>
      <PromptForm
        setPrompt={setPrompt}
        disabled={generationState !== GenerationState.IDLE}
      />
      {(answerWithoutQuotes !== '' || GenerationState.THINKING) && (
        <p className={styles.answer}>
          {generationState === GenerationState.THINKING
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
                {stats.gpuAdapter
                  ? `${stats.gpuAdapter.description ? stats.gpuAdapter.description : stats.gpuAdapter.vendor} (${stats.gpuAdapter.architecture})`
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
          generationState === GenerationState.IDLE && (
            <div className={styles.copy}>
              <Copy content={answerWithoutQuotes} />
            </div>
          )}
      </div>
    </div>
  );
};

export default Tweeter;
