import React from 'react';
import { PortalBox } from '@theme';
import styles from './ChangeModel.module.css';
import { formatBytes } from '@common/functions';
import Model from '../webLLM/Model';
import hasModelInCache from '../webLLM/utils/hasModelInCache';
import cn from '@common/classnames';

const ChangeModel: React.FC<{
  close: () => void;
  setModel: (model: Model) => void;
  models: { [key: string]: Model };
  activeModel: Model;
}> = ({ close, setModel, models, activeModel }) => {
  const [modelsKeysInCache, setModelKeysInCache] = React.useState<
    Array<string>
  >([]);
  React.useEffect(() => {
    Promise.all(
      Object.values(models).map((model) => hasModelInCache(model))
    ).then((results) => {
      const modelsInCache = Object.keys(models).filter((key, i) => results[i]);
      setModelKeysInCache(modelsInCache);
    });
  }, []);
  return (
    <PortalBox title="Change model" close={close} size="small">
      <p className={styles.desc}>
        Tweeter can be used with various LLMs. Depending on the application or
        device, some models work better or worse:
      </p>
      <div className={styles.buttons}>
        {Object.entries(models).map(([key, model]) => (
          <button
            className={cn(styles.button, {
              [styles.activeModel]: model.id === activeModel.id,
            })}
            onClick={() => {
              setModel(model);
              close();
            }}
          >
            <b>{model.title}</b> ({formatBytes(model.size)}
            {modelsKeysInCache.includes(key) ? '*' : ''})
          </button>
        ))}
      </div>
      <p className={styles.cached}>* Model is alreday cached</p>
    </PortalBox>
  );
};

export default ChangeModel;
