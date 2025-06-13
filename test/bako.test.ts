import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('resolve bako identity', async () => {
  const result = await agent.execute('Resolve address for nazeeh21');
  console.log('Bako resolve result:', result);
});

test('get name for resolver address', async () => {
  const result = await agent.execute('Get name for 0x6c49291704aDc561074d887603c0C5E98B162b8662b746A1c945Bb1C71E40f79');
  console.log('Bako get name result:', result);
}); 