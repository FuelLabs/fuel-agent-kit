import { test, beforeEach } from 'vitest';
import { getResolver, getName } from '../src/bako/resolver.js';
import { createTestAgent } from './setup.js';

let privateKey: string;

beforeEach(() => {
  const agent = createTestAgent();
  privateKey = agent.getCredentials().walletPrivateKey;
});

test('get resolver for bako identity', async () => {
  const result = await getResolver(
    { name: '@nazeeh21' },
  );
  console.log('Direct Bako resolve result:', result);
});

test('get name for resolver address', async () => {
  const result = await getName(
    { resolverAddress: '0x6c49291704aDc561074d887603c0C5E98B162b8662b746A1c945Bb1C71E40f79' },
  );
  console.log('Direct Bako get name result:', result);
}); 