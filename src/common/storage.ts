const MODEL_STORAGE_KEY = 'llm-models-loaded';

export const getModelsLoaded = (): string[] =>
  window.localStorage.getItem(MODEL_STORAGE_KEY)?.split(',') || [];

export const setModelLoaded = (model: string): void => {
  const models = getModelsLoaded();
  if (!models.includes(model)) {
    models.push(model);
  }
  window.localStorage.setItem(MODEL_STORAGE_KEY, models.join(','));
};

export const isModelLoaded = (model: string): boolean =>
  getModelsLoaded().includes(model);
