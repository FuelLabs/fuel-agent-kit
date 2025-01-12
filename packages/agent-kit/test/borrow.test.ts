import { test, beforeEach } from 'vitest';
import { FuelAgent } from '../src/FuelAgent.js';
import { createTestAgent } from './setup.js';

let agent: FuelAgent;

beforeEach(() => {
  agent = createTestAgent();
});

test('borrowAsset', async () => {
  console.log(await agent.execute('Borrow 11 USDC'));
});
