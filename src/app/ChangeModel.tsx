import React from 'react';
import { PortalBox } from '@theme';
import styles from './ChangeModel.module.css';
import { formatBytes } from '@common/functions';
import Model from '../webLLM/Model';

const ChangeModel: React.FC<{
  close: () => void;
  setModel: (model: Model) => void;
  models: { [key: string]: Model };
}> = ({ close, setModel, models }) => (
  <PortalBox title="Change model" close={close} size="small">
    <p className={styles.desc}>
      Tweeter can be used with various LLMs. Depending on the application or
      device, some models work better or worse:
    </p>
    <div className={styles.buttons}>
      {Object.values(models).map((value) => (
        <button
          className={styles.button}
          onClick={() => {
            setModel(value);
            close();
          }}
        >
          <b>{value.title}</b> ({formatBytes(value.size)})
        </button>
      ))}
    </div>
  </PortalBox>
);

export default ChangeModel;
