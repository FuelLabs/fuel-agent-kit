import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('swap exact input', async () => {
  console.log(
    await agent.swapExactInput({
      amount: '0.0001',
      fromSymbol: 'ETH',
      toSymbol: 'USDC',
    }),
  );
});

test('swap via natural language', async () => {
  console.log(await agent.execute('Swap 0.1 USDC to ETH with 5% slippage'));
});
