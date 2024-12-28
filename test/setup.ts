import { FuelAgent } from '../src/FuelAgent.js';
import type { modelMapping } from '../src/utils/models.js';

export type FuelAgentType = FuelAgent;

export const TEST_CREDENTIALS = {
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY!,
  modelName: "gemini-1.5-flash" as keyof typeof modelMapping,
  openAiApiKey: process.env.OPENAI_API_KEY!,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY!,
};

export const createTestAgent = () => {
  return new FuelAgent(TEST_CREDENTIALS);
};
