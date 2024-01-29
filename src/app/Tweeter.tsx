import React from 'react';
import cn from '@common/classnames';
import styles from './Tweeter.module.css';
import PromptForm from '@app/PromptForm';
import { Copy } from '@theme';
import { GenerationState, RuntimeStats } from '../webLLM/static/types';
import { round } from '@common/functions';

const Tweeter: React.FC<{
  generate: (
    prompt: string,
    rememberPreviousConversation?: boolean
  ) => Promise<string>;
  answer: string;
  generationState: GenerationState;
  runtimeStats: RuntimeStats;
}> = ({ generate, answer, generationState, runtimeStats }) => {
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
          {runtimeStats && (
            <p>
              Input:{' '}
              {runtimeStats.prefillTotalTokens ? (
                <span>
                  {runtimeStats.prefillTotalTokens} Tokens (
                  {round(runtimeStats.prefillTokensPerSec, 2)} tokens/sec)
                </span>
              ) : (
                <span>-</span>
              )}
            </p>
          )}
          {runtimeStats && (
            <p>
              Output:{' '}
              {runtimeStats.decodingTotalTokens ? (
                <span>
                  {runtimeStats.decodingTotalTokens} Tokens (
                  {round(runtimeStats.decodingTokensPerSec, 2)} tokens/sec)
                </span>
              ) : (
                <span>-</span>
              )}
            </p>
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
