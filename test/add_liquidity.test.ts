import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

// test('add liquidity', async () => {
//   console.log(
//     await agent.addLiquidity({
//       amount0: '0.0001',
//       asset0Symbol: 'USDT',
//       asset1Symbol: 'ETH',
//     }),
//   );
// });

test('add liquidity via natural language', async () => {
  const result = await agent.execute(
      'Add liquidity for 0.1 USDT into USDT and ETH pool with 5% slippage',
    )

    console.log('Natural language add liquidity result:', result);
});
