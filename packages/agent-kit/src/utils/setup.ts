import { Provider, Wallet } from 'fuels';

export class ProviderInstance {
  private static instance: Provider | null = null;
  private static readonly PROVIDER_URL =
    'https://mainnet.fuel.network/v1/graphql';

  private constructor() {} // Prevent direct construction

  public static async getProvider(): Promise<Provider> {
    if (!ProviderInstance.instance) {
      ProviderInstance.instance = await Provider.create(this.PROVIDER_URL);
    }
    return ProviderInstance.instance;
  }
}

export const setupWallet = async (privateKey: string) => {
  const provider = await ProviderInstance.getProvider();
  const wallet = Wallet.fromPrivateKey(privateKey, provider);

  return {
    wallet,
    provider,
  };
};
