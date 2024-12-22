import { orchestrator } from '../src/index.js';
import { test } from 'vitest';

test('orchestrator', async () => {
  const result = await orchestrator('swap usdc to eth');
  console.log(result);
});
