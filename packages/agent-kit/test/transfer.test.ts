import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('transfer USDC to another wallet', async () => {
  console.log(
    await agent.execute(
      'Transfer 2 USDC to 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
    ),
  );
});

test('forced error', async () => {
  console.log(
    await agent.execute(
      'Transfer 2000 USDC to 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
    ),
  );
});
