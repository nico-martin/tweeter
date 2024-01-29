/*import React from 'react';
import * as webllm from './lib';
import { setModelLoaded } from '@common/storage';

export enum ChatState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  ERROR = 'ERROR',
  LOADED = 'LOADED',
}

export enum GenerationState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  ANSWERING = 'ANSWERING',
}

export enum Model {
  LLAMA = 'Llama-2-7b-chat-hf',
  MISTRAL = 'Mistral-7B-Instruct-v0.2',
  TINYLAMA = 'TinyLlama-1.1B-Chat-v0.4',
  RED_PAJAMA = 'RedPajama-INCITE-Chat-3B-v1',
  //PHI2 = 'phi-2',
}

export const MODELS: Record<
  Model,
  {
    model_url: string;
    local_id: Model;
    model_lib_url: string;
    required_features?: Array<string>;
    vram_required_MB?: number;
    low_resource_required?: boolean;
    size: number;
  }
> = {
  [Model.LLAMA]: {
    size: 4222067327,
    model_url:
      'https://huggingface.co/mlc-ai/Llama-2-7b-chat-hf-q4f32_1-MLC/resolve/main/',
    local_id: Model.LLAMA,
    model_lib_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf/Llama-2-7b-chat-hf-q4f32_1-ctx4k_cs1k-webgpu.wasm',
  },
  [Model.MISTRAL]: {
    size: 4083348237,
    model_url:
      'https://huggingface.co/mlc-ai/Mistral-7B-Instruct-v0.2-q4f16_1-MLC/resolve/main/',
    local_id: Model.MISTRAL,
    model_lib_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm',
    required_features: ['shader-f16'],
  },
  [Model.TINYLAMA]: {
    size: 2206894175,
    model_url:
      'https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v0.4-q0f16-MLC/resolve/main/',
    local_id: Model.TINYLAMA,
    model_lib_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/TinyLlama-1.1B-Chat-v0.4/TinyLlama-1.1B-Chat-v0.4-q0f16-ctx2k-webgpu.wasm',
    vram_required_MB: 5063.52,
    low_resource_required: false,
    required_features: ['shader-f16'],
  },
  [Model.RED_PAJAMA]: {
    size: 1570705234,
    model_url:
      'https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC/resolve/main/',
    local_id: Model.RED_PAJAMA,
    model_lib_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1/RedPajama-INCITE-Chat-3B-v1-q4f16_1-ctx2k-webgpu.wasm',
    vram_required_MB: 2972.09,
    low_resource_required: false,
    required_features: ['shader-f16'],
  },
  /!*[Model.PHI2]: {
    size: 45000000000,
    model_url: 'https://huggingface.co/mlc-ai/phi-2-q0f16-MLC/resolve/main/',
    local_id: Model.PHI2,
    model_lib_url:
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/phi-2/phi-2-q0f16-ctx2k-webgpu.wasm',
  },*!/
};

const CONFIG: webllm.AppConfig = {
  model_list: Object.values(MODELS).map((model) => ({
    model_url: model.model_url,
    local_id: model.local_id,
    model_lib_url: model.model_lib_url,
    required_features: model.required_features || [],
    low_resource_required: model.low_resource_required || null,
    vram_required_MB: model.vram_required_MB || null,
  })),
};

const useWebLLM = (
  model: Model
): {
  init: () => Promise<void>;
  state: ChatState;
  generationState: GenerationState;
  activeReport: webllm.InitProgressReport;
  generate: (prompt: string) => Promise<string>;
  answer: string;
} => {
  const [state, setState] = React.useState<ChatState>(ChatState.IDLE);
  const [generationState, setGenerationState] = React.useState<GenerationState>(
    GenerationState.IDLE
  );

  const [activeReport, setActiveReport] =
    React.useState<webllm.InitProgressReport>();
  const [answer, setAnswer] = React.useState<string>('');

  const chat = React.useMemo(() => {
    const chat = new webllm.ChatModule();
    chat.setInitProgressCallback((report: webllm.InitProgressReport) =>
      setActiveReport(report)
    );
    return chat;
  }, []);

  const init = async () => {
    try {
      setState(ChatState.INITIALIZING);
      await chat.reload(model, undefined, CONFIG);
      setState(ChatState.LOADED);
      setModelLoaded(model);
    } catch (e) {
      console.log(e);
      setState(ChatState.ERROR);
    }
  };

  const generate = async (prompt: string) => {
    setGenerationState(GenerationState.LISTENING);
    setAnswer('');
    const response = await chat.generate(prompt, (step, message) => {
      setGenerationState(GenerationState.ANSWERING);
      setAnswer(message);
    });
    setGenerationState(GenerationState.IDLE);
    setAnswer(response);
    return response;
  };

  return {
    init,
    state,
    activeReport,
    generate,
    answer,
    generationState,
  };
};

export default useWebLLM;*/
