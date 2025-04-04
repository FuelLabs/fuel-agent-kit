import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('supplyCollateral', async () => {
  console.log(await agent.execute('Supply 0.1 USDT as collateral'));
});
