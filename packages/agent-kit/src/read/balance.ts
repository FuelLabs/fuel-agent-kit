import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { setupWallet, ProviderInstance } from '../utils/setup.js';

export type GetOwnBalanceParams = {
  symbol: string;
};

export const getOwnBalance = async (
  params: GetOwnBalanceParams,
  privateKey: string,
) => {
  try {
    const { wallet } = await setupWallet(privateKey);

    const allAssets = await getAllVerifiedFuelAssets();
    const asset = allAssets.find((asset) => asset.symbol === params.symbol);

    if (!asset) {
      throw new Error(`Asset ${params.symbol} not found`);
    }

    const balance = await wallet.getBalance(asset.assetId);

    return JSON.stringify({
      status: 'success',
      balance: balance.formatUnits(asset.decimals),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ===============================

export type GetBalanceParams = {
  walletAddress: string;
  assetSymbol: string;
};

export const getBalance = async (params: GetBalanceParams) => {
  try {
    const provider = await ProviderInstance.getProvider();

    const allAssets = await getAllVerifiedFuelAssets();
    const asset = allAssets.find(
      (asset) => asset.symbol === params.assetSymbol,
    );

    if (!asset) {
      throw new Error(`Asset ${params.assetSymbol} not found`);
    }

    const balance = await provider.getBalance(
      params.walletAddress,
      asset.assetId,
    );

    return JSON.stringify({
      status: 'success',
      balance: balance.formatUnits(asset.decimals),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
