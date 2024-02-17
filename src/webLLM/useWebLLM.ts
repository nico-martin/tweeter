import React from 'react';
import Model from './Model';
import { v4 as uuidv4 } from 'uuid';

import {
  ConvTemplateConfig,
  GenerationState,
  InitProgressCallbackReport,
  RuntimeStats,
} from './static/types';
import { WorkerRequest, WorkerResponse } from './worker/types';
import {
  dispatchWorkerEvent,
  getWorkerEventKey,
  onWorkerEvent,
} from './worker/client';

const useWebLLM = (): {
  workerBusy: boolean;
  model: Model;
  setModel: (model: Model) => void;
  loaderReport: InitProgressCallbackReport;
  modelLoaded: boolean;
  runtimeStats: RuntimeStats;
  error: string;
  answer: string;
  generationState: GenerationState;
  generate: (
    prompt: string,
    rememberPreviousConversation: boolean
  ) => Promise<string>;
  initiate: () => Promise<Model>;
} => {
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<Model>(null);
  const [loaderReport, setLoaderReport] =
    React.useState<InitProgressCallbackReport>({
      progress: 0,
      timeElapsed: 0,
      text: '',
    });
  const [modelLoaded, setModelLoaded] = React.useState<boolean>(false);
  const [conversationConfig, setConversationConfig] =
    React.useState<Partial<ConvTemplateConfig>>(null);
  const [answer, setAnswer] = React.useState<string>('');
  const [generationState, setGenerationState] = React.useState<GenerationState>(
    GenerationState.IDLE
  );
  const [runtimeStats, setRuntimeStats] = React.useState<RuntimeStats>(null);
  const [error, setError] = React.useState<string>(null);

  const worker = React.useRef(null);

  const postWorkerMessage = (payload: WorkerRequest) =>
    worker.current.postMessage(payload);

  React.useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL('./worker/worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }

    const onMessageReceived = (e: MessageEvent<WorkerResponse>) =>
      dispatchWorkerEvent(e.data);

    worker.current.addEventListener('message', onMessageReceived);
    return () =>
      worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  React.useEffect(() => {
    setModelLoaded(false);
  }, [model, conversationConfig]);

  const initiate = (): Promise<Model> =>
    new Promise((resolve, reject) => {
      modelLoaded && resolve(model);
      generate()
        .then(() => resolve(model))
        .catch(reject);
    });

  const generate = (
    prompt: string = '',
    rememberPreviousConversation: boolean = false
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      setWorkerBusy(true);
      const requestId = uuidv4();
      postWorkerMessage({
        model,
        prompt,
        rememberPreviousConversation,
        conversationConfig,
        requestId,
      });
      onWorkerEvent(requestId, (data: WorkerResponse) => {
        console.log(data);
        switch (data.status) {
          case 'progress': {
            setGenerationState(GenerationState.INITIALIZING);
            setLoaderReport({
              progress: data.progress,
              timeElapsed: data.timeElapsed,
              text: data.text,
            });
            break;
          }
          case 'initDone': {
            setGenerationState(GenerationState.THINKING);
            break;
          }
          case 'update': {
            setGenerationState(GenerationState.ANSWERING);
            setAnswer(data.output || '');
            setRuntimeStats(data.runtimeStats);
            break;
          }
          case 'complete': {
            setGenerationState(GenerationState.COMPLETE);
            setAnswer(data.output || '');
            setRuntimeStats(data.runtimeStats);
            resolve(data.output);
            break;
          }
          case 'error': {
            setGenerationState(GenerationState.ERROR);
            setError(data.error);
            reject(data.error);
            break;
          }
        }
      });
    });

  return {
    workerBusy,
    model,
    setModel,
    loaderReport,
    modelLoaded,
    runtimeStats,
    error,
    answer,
    generationState,
    generate,
    initiate,
  };
};

export default useWebLLM;
