import { beforeEach, test } from 'vitest';
import { createTestAgent } from './setup.js';
import type { FuelAgent } from '../src/FuelAgent.js';

let agent: FuelAgent;

beforeEach(() => {
  agent = createTestAgent();
});

test('get own balance', async () => {
  const balance = await agent.execute('Get my USDC balance');
  console.log(balance);
});

test('get balance of a wallet', async () => {
  const balance = await agent.execute(
    'Get the ETH balance of 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
  );
  console.log(balance);
});
