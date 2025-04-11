import { BakoIDClient } from '@bako-id/sdk';
import { Wallet } from 'fuels';
import { ProviderInstance } from '../utils/setup.js';

export type ResolverParams = {
  identity: string;
};

export type ResolverNameParams = {
  resolverAddress: string;
};

export const getResolver = async (params: ResolverParams, privateKey: string) => {
  try {
    const { identity } = params;
    const provider = await ProviderInstance.getProvider();
    const wallet = Wallet.fromPrivateKey(privateKey, provider);

    const client = new BakoIDClient('https://mainnet.fuel.network/v1/graphql');
    const result = await client.resolver(identity, 1); // 1 is the chainId for mainnet

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

export const getName = async (params: ResolverNameParams, privateKey: string) => {
  try {
    const { resolverAddress } = params;
    const provider = await ProviderInstance.getProvider();
    const wallet = Wallet.fromPrivateKey(privateKey, provider);

    const client = new BakoIDClient('https://mainnet.fuel.network/v1/graphql');
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