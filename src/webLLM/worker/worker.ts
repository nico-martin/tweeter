import { WorkerResponse, WorkerRequest } from './types';
import Model from '../Model';
import { ConvTemplateConfig, InitProgressCallback } from '../static/types';
import Generator from '../Generator';

const postMessage = (e: WorkerResponse) => self.postMessage(e);

class GeneratorInstance {
  public model: Model = null;
  private static instance: GeneratorInstance = null;
  private generator = null;
  private conversationConfig: Partial<ConvTemplateConfig> = null;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new GeneratorInstance();
    }
    return this.instance;
  }

  public async loadGenerator(
    model: Model,
    conversationConfig: Partial<ConvTemplateConfig>,
    callback: InitProgressCallback
  ): Promise<Generator> {
    if (
      model.id === this.model?.id &&
      JSON.stringify(conversationConfig) ===
        JSON.stringify(this.conversationConfig) &&
      this.generator
    ) {
      return this.generator;
    }
    if (this.generator) {
      await this.generator.dispose();
    }

    const generator = new Generator(model, conversationConfig);
    generator.setInitProgressCallback(callback);
    await generator.load();

    this.model = model;
    this.conversationConfig = conversationConfig;
    this.generator = generator;
    return this.generator;
  }
}

self.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const instance = GeneratorInstance.getInstance();
  try {
    const generator = await instance.loadGenerator(
      event.data.model,
      event.data.conversationConfig,
      (x) => {
        postMessage({
          status: 'progress',
          requestId: event.data.requestId,
          progress: x.progress,
          timeElapsed: x.timeElapsed,
          text: x.text,
        });
      }
    );

    if (!event.data.prompt) {
      postMessage({
        status: 'complete',
        requestId: event.data.requestId,
      });
    }

    postMessage({
      status: 'initDone',
      requestId: event.data.requestId,
    });

    const output = await generator.generate(
      event.data.prompt,
      (step, message) => {
        postMessage({
          status: 'update',
          requestId: event.data.requestId,
          output: message,
          runtimeStats: generator.getRuntimeStats(),
        });
      },
      event.data.rememberPreviousConversation
    );
    postMessage({
      status: 'complete',
      requestId: event.data.requestId,
      output,
      runtimeStats: generator.getRuntimeStats(),
    });
  } catch (e) {
    postMessage({
      status: 'error',
      requestId: event.data.requestId,
      error: e.message,
    });
  }
});
