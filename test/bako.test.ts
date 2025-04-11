import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('resolve bako identity', async () => {
  const result = await agent.execute('Get resolver for bako.id/example');
  console.log('Bako resolve result:', result);
});

test('get name for resolver address', async () => {
  const result = await agent.execute('Get name for 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
  console.log('Bako get name result:', result);
}); 