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
    { identity: 'bako.id/naz3eh' },
    privateKey,
  );
  console.log('Direct Bako resolve result:', result);
});

test('get name for resolver address', async () => {
  const result = await getName(
    { resolverAddress: '0x05D6E170E2e7Ae00Fc147c4D0C3A13D06c77A40794782d9ec10Ea6f5BD23eB1d' },
    privateKey,
  );
  console.log('Direct Bako get name result:', result);
}); 