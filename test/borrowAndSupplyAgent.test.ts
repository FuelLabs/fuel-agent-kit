import { test } from 'vitest';
import { borrowAndSupplyAgent } from '../src/index.js';

test('borrow and supply agent', async () => {
  const result = await borrowAndSupplyAgent('supply 100 USDC as collateral');
  console.log(result);
});
