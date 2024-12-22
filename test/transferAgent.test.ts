import { test } from 'vitest';
import { transferAndSwapAgent } from '../src/index.js';

test('borrow and supply agent', async () => {
  const result = await transferAndSwapAgent('swap 100 USDC to eth');
  console.log(result);
});
