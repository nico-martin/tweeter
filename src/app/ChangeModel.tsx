import React from 'react';
import { Model, MODELS } from '../webLLM/useWebLLM';
import { PortalBox } from '@theme';
import styles from './ChangeModel.module.css';
import { formatBytes } from '@common/functions';

const ChangeModel: React.FC<{
  close: () => void;
  setModel: (model: Model) => void;
}> = ({ close, setModel }) => (
  <PortalBox title="Change model" close={close} size="small">
    <p className={styles.desc}>
      Tweeter can be used with various LLMs. Depending on the application or
      device, some models work better or worse:
    </p>
    <div className={styles.buttons}>
      {Object.entries(MODELS).map(([key, value]) => (
        <button
          className={styles.button}
          onClick={() => {
            setModel(key as Model);
            close();
          }}
        >
          <b>{key}</b> ({formatBytes(value.size)})
        </button>
      ))}
    </div>
  </PortalBox>
);

export default ChangeModel;
