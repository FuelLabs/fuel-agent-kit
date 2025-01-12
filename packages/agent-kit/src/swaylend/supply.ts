import { bn } from 'fuels';
import { Market } from '../types/Market.js';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { setupWallet } from '../utils/setup.js';
import { getTxExplorerUrl } from '../utils/explorer.js';

export type SupplyCollateralParams = {
  amount: string;
  symbol: string;
};

export const supplyCollateral = async (
  params: SupplyCollateralParams,
  privateKey: string,
) => {
  try {
    const { wallet } = await setupWallet(privateKey);

    const marketContractId =
      '0x657ab45a6eb98a4893a99fd104347179151e8b3828fd8f2a108cc09770d1ebae';
    const marketContract: Market = new Market(marketContractId, wallet);

    const allAssets = await getAllVerifiedFuelAssets();
    const asset = allAssets.find((asset) => asset.symbol === params.symbol);
    const assetId = asset?.assetId;

    const weiAmount = bn.parseUnits(params.amount, asset?.decimals);

    const tx = await marketContract.functions
      .supply_collateral()
      .callParams({
        forward: {
          assetId: assetId,
          amount: weiAmount,
        } as any,
      })
      .call();

    const { transactionId } = await tx.waitForResult();

    return JSON.stringify({
      status: 'success',
      id: transactionId,
      link: getTxExplorerUrl(transactionId),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
