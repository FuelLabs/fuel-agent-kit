import { FuelAgent } from '../../../../src/FuelAgent.js';

export const agent = new FuelAgent({
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY ?? '',
  model: 'gpt-4o-mini',
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
});
