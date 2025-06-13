import { BakoIDClient } from '@bako-id/sdk';
import { Wallet } from 'fuels';
import { ProviderInstance } from '../utils/setup.js';

export type ResolverParams = {
  name: string;
};

export type ResolverNameParams = {
  resolverAddress: string;
};

export const getResolver = async (params: ResolverParams) => {
  try {
    const { name } = params;
    const provider = await ProviderInstance.getProvider();
    // const wallet = Wallet.fromPrivateKey(privateKey, provider);

    const client = new BakoIDClient();
    const result = await client.resolver(name, 1); // 1 is the chainId for mainnet

    return JSON.stringify({
      status: 'success',
      resolver: result,
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getName = async (params: ResolverNameParams) => {
  try {
    const { resolverAddress } = params;
    const provider = await ProviderInstance.getProvider();
    // const wallet = Wallet.fromPrivateKey(privateKey, provider);

    const client = new BakoIDClient();
    const result = await client.name(resolverAddress, 1); // 1 is the chainId for mainnet

    return JSON.stringify({
      status: 'success',
      name: result,
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 