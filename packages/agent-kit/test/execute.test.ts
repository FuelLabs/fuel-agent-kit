import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('execute swap', async () => {
  console.log(await agent.execute('swap 5 usdc for eth'));
});
