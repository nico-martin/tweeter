import React from 'react';
import { Icon } from '@theme';
import { IconName } from './theme/SVG/icons';
import styles from './App.module.css';
import ChangeModel from '@app/ChangeModel';
import Main from '@app/Main';
import Model from './webLLM/Model';
import Llama27BChat from './webLLM/models/Llama27BChat';
import Mistral7BInstruct from './webLLM/models/Mistral7BInstruct';
import RedPajamaINCITEChat3B from './webLLM/models/RedPajamaINCITEChat3B';
import TinyLlama11BChat from './webLLM/models/TinyLlama1-1BChat';

const MODELS: { [key: string]: Model } = {
  llama27BChat: Llama27BChat,
  mMistral7BInstruct: Mistral7BInstruct,
  redpajamaChat: RedPajamaINCITEChat3B,
  tinyLlama11BChat: TinyLlama11BChat,
};

const App: React.FC<{}> = () => {
  const [model, setModel] = React.useState<Model>(Object.values(MODELS)[0]);
  const [modelModal, setModelModal] = React.useState<boolean>(false);
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <Icon className={styles.titleIcon} icon={IconName.TWITTER} />
          <span className={styles.titleText}>Tweeter</span>
        </h1>
        <p className={styles.claim}>
          <i>
            Have your tweets written by AI.
            <br />
            Directly in the browser.
          </i>
        </p>
      </header>
      <div className={styles.modelSettings}>
        {modelModal && (
          <ChangeModel
            close={() => setModelModal(false)}
            setModel={setModel}
            models={MODELS}
          />
        )}
        <button
          onClick={() => setModelModal(true)}
          className={styles.modelSettingsButton}
        >
          <Icon
            className={styles.modelSettingsButtonRobot}
            icon={IconName.ROBOT_CONFUSED_OUTLINE}
          />
          {model.title}{' '}
          <Icon
            className={styles.modelSettingsButtonUnfold}
            icon={IconName.UNFOLD_MORE_HORIZONTAL}
          />
        </button>
      </div>
      <Main model={model} className={styles.main} key={model.id} />
    </div>
  );
};

const AppWrapper: React.FC = () => <App />;

export default AppWrapper;
