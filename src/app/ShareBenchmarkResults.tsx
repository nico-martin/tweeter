import React from 'react';
import {
  FieldInput,
  Form,
  FormControls,
  FormElement,
  Modal,
  Notification,
  NotificationType,
} from '@theme';
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
  modelName: string;
}

const ShareBenchmarkResults: React.FC<{
  close: Function;
  stats: RuntimeStats;
  gpuAdapterInfo: GPUAdapterInfo;
  modelName: string;
}> = ({ close, stats, gpuAdapterInfo, modelName }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<boolean>(false);
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
      modelName,
    },
  });

  return (
    <Modal close={close} title="share results">
      {success ? (
        <div>
          <br />
          <Notification type={NotificationType.SUCCESS}>
            Thank you so much!
            <br />
            Your benchmark results will be reviewed and published soon.
          </Notification>
        </div>
      ) : (
        <FormProvider {...methods}>
          <Form
            className={styles.form}
            onSubmit={methods.handleSubmit((data: FormData) => {
              setLoading(true);
              setError('');
              fetch('https://tweeter.nico.dev/benchmark-test/email.php', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((response) => {
                  try {
                    if (response.success === true) {
                      setSuccess(true);
                    } else {
                      setError('An error occured. Please try again later.');
                    }
                  } catch (e) {
                    setError('An error occured. Please try again later.');
                  }
                })
                .catch(() =>
                  setError('An error occured. Please try again later.')
                )
                .finally(() => setLoading(false));
            })}
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
                  label="Device Brand (Apple, Dell, Lenovo etc.)"
                  Input={FieldInput}
                  name="deviceBrand"
                />
                <FormElement
                  label="Device Type (MacBook Air, XPS, etc.)"
                  Input={FieldInput}
                  name="deviceType"
                />
                <FormElement
                  label="Processor Family"
                  Input={FieldInput}
                  name="cpu"
                />
                <FormElement label="GPU" Input={FieldInput} name="gpu" />
                <FormElement label="RAM" Input={FieldInput} name="ram" />
              </div>
              <div className={styles.fieldsContainerElement}>
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
                <FormElement
                  label="Model"
                  Input={FieldInput}
                  name="modelName"
                  disabled
                />
              </div>
            </div>
            <p className={styles.info}>
              By clicking on "send" you agree that the above data will be
              published anonymously.
            </p>
            {error !== '' && (
              <Notification type={NotificationType.ERROR}>{error}</Notification>
            )}
            <FormControls
              align="right"
              value="Send"
              icon={IconName.SEND}
              loading={loading}
            />
          </Form>
        </FormProvider>
      )}
    </Modal>
  );
};

export default ShareBenchmarkResults;
