import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('swap exact input', async () => {
  console.log('Starting swap exact input test...');
  const result = await agent.swapExactInput({
    amount: '0.1',
    fromSymbol: 'USDT',
    toSymbol: 'ETH',
  });
  console.log('Swap result:', result);
});

test('swap via natural language', async () => {
  console.log('Starting natural language swap test...');
  const result = await agent.execute('Swap 0.1 USDT to ETH with 5% slippage');
  console.log('Natural language swap result:', result);
});
