import React from 'react';
import Model from './webLLM/Model';
import { Icon } from '@theme';
import { IconName } from './theme/SVG/icons';
import styles from './App.module.css';
import ChangeModel from '@app/ChangeModel';
import Main from '@app/Main';
import Generator from './webLLM/Generator';
import RedPajamaINCITEChat3B from './webLLM/models/RedPajamaINCITEChat3B';

const App: React.FC<{}> = () => {
  const [model, setModel] = React.useState<Model>(RedPajamaINCITEChat3B);
  //const [progress, setProgress] = React.useState<number>(0);
  const generator = React.useMemo(() => {
    const gen = new Generator(model);
    console.log(gen.modelInCache);
    gen.setInitProgressCallback((progress: number) => console.log(progress));
    return gen;
  }, [model]);

  return (
    <div>
      <button onClick={() => generator.load()}>load</button>
    </div>
  );

  /*const [model, setModel] = React.useState<Model>(
    Object.keys(MODELS)[0] as Model
  );
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
          <ChangeModel close={() => setModelModal(false)} setModel={setModel} />
        )}
        <button
          onClick={() => setModelModal(true)}
          className={styles.modelSettingsButton}
        >
          <Icon
            className={styles.modelSettingsButtonRobot}
            icon={IconName.ROBOT_CONFUSED_OUTLINE}
          />
          {model}{' '}
          <Icon
            className={styles.modelSettingsButtonUnfold}
            icon={IconName.UNFOLD_MORE_HORIZONTAL}
          />
        </button>
      </div>
      <Main model={model} className={styles.main} key={model} />
    </div>
  );*/
};

const AppWrapper: React.FC = () => <App />;

export default AppWrapper;
