import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('execute swap', async () => {
  console.log(await agent.execute('swap 0.1 usdt for eth'));
});
