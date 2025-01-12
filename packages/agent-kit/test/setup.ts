import { FuelAgent, type FuelAgentConfig } from '../src/FuelAgent.js';

export type FuelAgentType = FuelAgent;

export const TEST_CREDENTIALS: FuelAgentConfig = {
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY!,
  model: 'gpt-4o-mini',
  openAiApiKey: process.env.OPENAI_API_KEY!,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY!,
};

export const createTestAgent = () => {
  return new FuelAgent(TEST_CREDENTIALS);
};
