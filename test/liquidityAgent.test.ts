import { test } from 'vitest';
import { liquidityAgent } from '../src/index.js';

test('liquidity agent', async () => {
  const result = await liquidityAgent('add liquidity 100 USDC and ETH');
  console.log(result);
});
