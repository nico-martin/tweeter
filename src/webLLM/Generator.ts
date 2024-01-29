import * as tvmjs from '@nico-martin/tvmjs';
import Model from './Model';
import { Tokenizer } from '@mlc-ai/web-tokenizers';
import Pipeline from './Pipeline';
import {
  InitProgressCallback,
  ChatConfig,
  ConvTemplateConfig,
} from './static/types';
import {
  CONFIG_CACHE_SCOPE,
  MODEL_CACHE_SCOPE,
  WASM_CACHE_SCOPE,
} from './static/constants';
import hasModelInCache from './utils/hasModelInCache';

const configCache = new tvmjs.ArtifactCache(CONFIG_CACHE_SCOPE);
const wasmCache = new tvmjs.ArtifactCache(WASM_CACHE_SCOPE);

class Generator {
  private model: Model;

  private pipeline?: Pipeline = null;
  private initProgressCallback?: InitProgressCallback;
  public modelInCache: boolean = false;
  public modelLoaded: boolean = false;
  private conversationConfig: Partial<ConvTemplateConfig> = {};

  setInitProgressCallback(initProgressCallback: InitProgressCallback) {
    this.initProgressCallback = initProgressCallback;
  }

  constructor(
    model: Model,
    conversationConfig: Partial<ConvTemplateConfig> = {}
  ) {
    this.setModel(model, conversationConfig);
  }

  private async setModel(
    model: Model,
    conversationConfig: Partial<ConvTemplateConfig> = {}
  ) {
    this.model = model;
    this.modelLoaded = false;
    this.modelInCache = await hasModelInCache(model);
    this.conversationConfig = conversationConfig;
  }

  public async load() {
    await this.unload();
    const tstart = performance.now();

    const baseUrl =
      typeof document !== 'undefined'
        ? document.URL
        : globalThis.location.origin;
    let modelUrl = this.model.url;
    if (!modelUrl.startsWith('http')) {
      modelUrl = new URL(modelUrl, baseUrl).href;
    }

    const configUrl = new URL('mlc-chat-config.json', modelUrl).href;
    const config = {
      ...(await (await configCache.fetchWithCache(configUrl)).json()),
      //...chatOpts, todo
    } as ChatConfig;
    config.conv_config = {
      ...config.conv_config,
      ...this.conversationConfig,
    };

    const wasmUrl = this.model.libUrl;
    if (wasmUrl === undefined) {
      throw Error(
        'You need to specify `model_lib_url` for each model in `model_list` ' +
          'so that we can download the model library (i.e. wasm file).'
      );
    }

    const fetchWasmSource = async () => {
      if (wasmUrl.includes('localhost')) {
        // do not cache wasm on local host as we might update code frequently
        return await fetch(wasmUrl);
      } else if (!wasmUrl.startsWith('http')) {
        // do not cache wasm on the same server as it can also refresh
        // rely on the normal caching strategy
        return await fetch(new URL(wasmUrl, baseUrl).href);
      } else {
        // use cache
        return await wasmCache.fetchWithCache(wasmUrl);
      }
    };
    const wasmSource = await (await fetchWasmSource()).arrayBuffer();

    const tvm = await tvmjs.instantiate(
      new Uint8Array(wasmSource),
      tvmjs.createPolyfillWASI()
    );

    if (this.initProgressCallback !== undefined) {
      tvm.registerInitProgressCallback(this.initProgressCallback);
    }

    const gpuDetectOutput = await tvmjs.detectGPUDevice();
    if (gpuDetectOutput == undefined) {
      throw Error('Cannot find WebGPU in the environment');
    }

    // check whether maxStorageBufferBindingSize falls from 1GB to 128MB
    const computeMB = (value: number) => {
      return Math.ceil(value / (1 << 20)) + 'MB';
    };
    const defaultRequiredMaxStorageBufferBindingSize = 1 << 30; // 1GB
    if (
      gpuDetectOutput.device.limits.maxStorageBufferBindingSize <
      defaultRequiredMaxStorageBufferBindingSize
    ) {
      console.log(
        `WARNING: the current maxStorageBufferBindingSize ` +
          `(${computeMB(gpuDetectOutput.device.limits.maxStorageBufferBindingSize)}) ` +
          `may only work for a limited number of models, e.g.: \n` +
          `- Llama-2-7b-chat-hf-q4f16_1-1k \n` +
          `- RedPajama-INCITE-Chat-3B-v1-q4f16_1-1k \n` +
          `- RedPajama-INCITE-Chat-3B-v1-q4f32_1-1k`
      );
    }

    let gpuLabel = 'WebGPU';
    if (gpuDetectOutput.adapterInfo.description.length != 0) {
      gpuLabel += ' - ' + gpuDetectOutput.adapterInfo.description;
    } else {
      gpuLabel += ' - ' + gpuDetectOutput.adapterInfo.vendor;
    }
    if (this.model.requiredFeatures !== undefined) {
      for (const feature of this.model.requiredFeatures) {
        if (!gpuDetectOutput.device.features.has(feature)) {
          if (feature == 'shader-f16') {
            throw Error(
              'This model requires WebGPU extension shader-f16, ' +
                'which is not enabled in this browser. ' +
                'You can try to launch Chrome Canary in command line with flag "--enable-dawn-features=allow_unsafe_apis".'
            );
          }
          throw Error(
            'This model requires feature ' +
              feature +
              ', which is not yet supported by this browser. '
          );
        }
      }
    }

    tvm.initWebGPU(gpuDetectOutput.device);
    const tokenizer = await this.asyncLoadTokenizer(modelUrl, config);
    await tvm.fetchNDArrayCache(modelUrl, tvm.webgpu(), MODEL_CACHE_SCOPE);

    this.pipeline = new Pipeline(tvm, tokenizer, config);
    await this.pipeline?.asyncLoadWebGPUPipelines();

    const tend = performance.now();

    if (this.initProgressCallback !== undefined) {
      const text = 'Finish loading on ' + gpuLabel;
      this.initProgressCallback({
        progress: 1,
        timeElapsed: (tend - tstart) / 1e3,
        text: text,
      });
    }

    this.modelLoaded = true;
    this.modelInCache = true;
  }

  async unload() {
    this.pipeline?.dispose();
    this.pipeline = null;
    this.modelLoaded = false;
  }

  private async asyncLoadTokenizer(
    baseUrl: string,
    config: ChatConfig
  ): Promise<Tokenizer> {
    const modelCache = new tvmjs.ArtifactCache(MODEL_CACHE_SCOPE);
    if (config.tokenizer_files.includes('tokenizer.json')) {
      const url = new URL('tokenizer.json', baseUrl).href;
      const model = await (await modelCache.fetchWithCache(url)).arrayBuffer();
      return Tokenizer.fromJSON(model);
    } else if (config.tokenizer_files.includes('tokenizer.model')) {
      const url = new URL('tokenizer.model', baseUrl).href;
      const model = await (await modelCache.fetchWithCache(url)).arrayBuffer();
      return Tokenizer.fromSentencePiece(model);
    }
    throw Error('Cannot handle tokenizer files ' + config.tokenizer_files);
  }
}

export default Generator;
