import React from 'react';
import cn from '@common/classnames';
import styles from './Tweeter.module.css';
import PromptForm from '@app/PromptForm';
import { GenerationState } from '../webLLM/useWebLLM';
import { Copy } from '@theme';

const Tweeter: React.FC<{
  generate: (prompt: string) => Promise<string>;
  answer: string;
  generationState: GenerationState;
}> = ({ generate, answer, generationState }) => {
  const [prompt, setPrompt] = React.useState<string>('');
  const [activePrompt, setActivePrompt] = React.useState<string>('');

  React.useEffect(() => {
    if (prompt && prompt !== activePrompt) {
      console.log(prompt);
      setActivePrompt(prompt);
      generate(prompt);
    }
  }, [prompt]);

  return (
    <div className={cn(styles.root)}>
      <PromptForm
        setPrompt={setPrompt}
        disabled={generationState !== GenerationState.IDLE}
      />
      {answer !== '' && (
        <p className={styles.answer}>
          {generationState === GenerationState.LISTENING
            ? 'thinking...'
            : answer}
        </p>
      )}
      {answer !== '' && generationState === GenerationState.IDLE && (
        <div className={styles.copy}>
          <Copy content={answer} />
        </div>
      )}
    </div>
  );
};

export default Tweeter;
