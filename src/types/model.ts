export type Tier = 'frontier' | 'standard' | 'lite';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  link: string;
  description: string;
  releaseDate: string;
  contextWindow: number;
  maxOutput: number;
  knowledgeCutoff: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
  consumerPlanName: string | null;
  consumerPlanPricePerMonth: number | null;
  openSource: boolean;
  multimodal: boolean;
  vision: boolean;
  audio: boolean;
  video: boolean;
  functionCalling: boolean;
  jsonMode: boolean;
  fineTuning: boolean;
  streaming: boolean;
  batchAPI: boolean;
  promptCaching: boolean;
  extendedThinking: boolean;
  codeCapability: number;
  reasoningCapability: number;
  multilingualCapability: number;
  safetyRating: number;
  speedRating: number;
  tags: string[];
  tier: Tier;
}

export interface ModelsData {
  models: AIModel[];
}
