import React from 'react';
import { FieldInput, Form, FormControls, FormElement, Modal } from '@theme';
import { FormProvider, useForm } from 'react-hook-form';
import { IconName } from '../theme/SVG/icons';
import * as platfrom from 'platform';
import { RuntimeStats } from '../webLLM/static/types';
import { round } from '@common/functions';
import styles from './ShareBenchmarkResults.module.css';

interface FormData {
  os: string;
  browser: string;
  browserVersion: string;
  webGpuAdapter: string;
  inputTps: string;
  outputTps: string;
  deviceBrand: string;
  deviceType: string;
  cpu: string;
  gpu: string;
  ram: string;
}

const ShareBenchmarkResults: React.FC<{
  close: Function;
  stats: RuntimeStats;
  gpuAdapterInfo: GPUAdapterInfo;
}> = ({ close, stats, gpuAdapterInfo }) => {
  const methods = useForm<FormData>({
    defaultValues: {
      os: `${platfrom.os?.family || ''} ${platfrom.os?.version || ''}`,
      browser: platfrom.name,
      browserVersion: platfrom.version,
      webGpuAdapter: gpuAdapterInfo
        ? `${gpuAdapterInfo.description ? gpuAdapterInfo.description : gpuAdapterInfo.vendor} (${gpuAdapterInfo.architecture})`
        : '',
      inputTps: stats ? `${round(stats.prefillTokensPerSec, 2)}` : '',
      outputTps: stats ? `${round(stats.decodingTokensPerSec, 2)}` : '',
      deviceBrand: '',
      deviceType: '',
      cpu: '',
      gpu: '',
      ram: '',
    },
  });

  return (
    <Modal close={close} title="share results">
      <FormProvider {...methods}>
        <Form
          className={styles.form}
          onSubmit={methods.handleSubmit((data: FormData) => {})}
        >
          <div className={styles.fieldsContainer}>
            <div className={styles.fieldsContainerElement}>
              <FormElement
                label="Operating System"
                Input={FieldInput}
                name="os"
                disabled
              />
              <FormElement
                label="Browser"
                Input={FieldInput}
                name="browser"
                disabled
              />
              <FormElement
                label="Browser Version"
                Input={FieldInput}
                name="browserVersion"
                disabled
              />
              <FormElement
                label="WebGPU Adapter"
                Input={FieldInput}
                name="webGpuAdapter"
                disabled
              />
              <FormElement
                label="Input tokens/sec"
                Input={FieldInput}
                name="inputTps"
                disabled
              />
              <FormElement
                label="Output tokens/sec"
                Input={FieldInput}
                name="outputTps"
                disabled
              />
            </div>
            <div className={styles.fieldsContainerElement}>
              <FormElement
                label="Device Brand"
                Input={FieldInput}
                name="deviceBrand"
                placeholder="e.g. Apple, Dell, Lenovo, Custom etc."
              />
              <FormElement
                label="Device Type"
                Input={FieldInput}
                name="deviceType"
                placeholder="e.g. MacBook Air, XPS, etc."
              />
              <FormElement
                label="Processor Family"
                Input={FieldInput}
                name="cpu"
              />
              <FormElement label="GPU" Input={FieldInput} name="gpu" />
              <FormElement label="RAM" Input={FieldInput} name="ram" />
              <FormElement
                label="Processor Family"
                Input={FieldInput}
                name="cpu"
              />
            </div>
          </div>
          <p className={styles.info}>
            By clicking on "send" you agree that the above data will be
            published anonymously.
          </p>
          <FormControls align="right" value="Send" icon={IconName.SEND} />
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default ShareBenchmarkResults;
