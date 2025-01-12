import { bn } from 'fuels';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { getTxExplorerUrl } from '../utils/explorer.js';
import { setupWallet } from '../utils/setup.js';

export type TransferParams = {
  to: string;
  amount: string;
  symbol: string;
};

export const transfer = async (params: TransferParams, privateKey: string) => {
  try {
    const { wallet } = await setupWallet(privateKey);

    const allAssets = await getAllVerifiedFuelAssets();
    const asset = allAssets.find((asset) => asset.symbol === params.symbol);
    const assetId = asset?.assetId;

    if (!assetId) {
      throw new Error(`Asset ${params.symbol} not found`);
    }

    const response = await wallet.transfer(
      params.to,
      bn.parseUnits(params.amount, asset.decimals),
      assetId,
    );
    const { id, isStatusFailure } = await response.waitForResult();

    if (isStatusFailure) {
      console.error('TX failed');
    }

    return JSON.stringify({
      status: 'success',
      id,
      link: getTxExplorerUrl(id),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
