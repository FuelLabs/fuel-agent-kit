import { bn, Provider } from 'fuels';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { buildPoolId, MiraAmm, ReadonlyMiraAmm } from 'mira-dex-ts';
import { setupWallet } from '../utils/setup.js';
import { getTxExplorerUrl } from '../utils/explorer.js';
import { DEFAULT_SLIPPAGE } from '../constants.js';

async function futureDeadline(provider: Provider) {
  const block = await provider.getBlock('latest');
  return block?.height.add(1000) ?? 1000000000;
}

export type SwapExactInputParams = {
  amount: string;
  fromSymbol: string;
  toSymbol: string;
  slippage?: number;
};

export const swapExactInput = async (
  params: SwapExactInputParams,
  privateKey: string,
) => {
  try {
    const { wallet, provider } = await setupWallet(privateKey);
    const assets = await getAllVerifiedFuelAssets();

    const fromAsset = assets.find(
      (asset) => asset.symbol === params.fromSymbol,
    );
    const toAsset = assets.find((asset) => asset.symbol === params.toSymbol);

    if (!fromAsset) {
      throw new Error(`Asset ${params.fromSymbol} not found`);
    }

    if (!toAsset) {
      throw new Error(`Asset ${params.toSymbol} not found`);
    }

    const fromAssetId = fromAsset?.assetId;
    const toAssetId = toAsset?.assetId;

    if (!fromAssetId) {
      throw new Error(`Asset ${params.fromSymbol} not found`);
    }

    if (!toAssetId) {
      throw new Error(`Asset ${params.toSymbol} not found`);
    }

    const fromAssetDecimals = fromAsset?.decimals;
    const toAssetDecimals = toAsset?.decimals;

    if (!fromAssetDecimals) {
      throw new Error(`Asset ${params.fromSymbol} not found`);
    }

    if (!toAssetDecimals) {
      throw new Error(`Asset ${params.toSymbol} not found`);
    }

    const amountInWei = bn.parseUnits(params.amount, fromAssetDecimals);

    let isStable =
      fromAsset.symbol.includes('USD') && toAsset.symbol.includes('USD');

    const poolId = buildPoolId(fromAssetId, toAssetId, isStable);

    const miraAmm = new MiraAmm(wallet);

    const deadline = await futureDeadline(provider);
    const miraAmmReader = new ReadonlyMiraAmm(provider);

    // Calculate the expected output amount
    const result = await miraAmmReader.getAmountsOut(
      { bits: fromAssetId },
      amountInWei,
      [poolId],
    );

    if (!result || result.length === 0 || !result[0] || result[0].length < 2) {
      throw new Error('Failed to calculate output amount');
    }

    let amountOutWei;
    if (result[1] && result[1][0].bits === toAssetId) {
      amountOutWei = result[1][1];
    } else if (result[0][0].bits === toAssetId) {
      amountOutWei = result[0][1];
    }

    if (!amountOutWei) {
      throw new Error('Failed to calculate output amount');
    }

    const minAmountOut = amountOutWei
      .mul(bn(100 - Math.floor((params.slippage || DEFAULT_SLIPPAGE) * 100)))
      .div(bn(100));

    const req = await miraAmm.swapExactInput(
      amountInWei,
      {
        bits: fromAssetId,
      },
      minAmountOut,
      [poolId],
      deadline,
      {
        gasLimit: 1000000,
        maxFee: 1000000,
      },
    );

    const tx = await wallet.sendTransaction(req);

    const { id } = await tx.waitForResult();

    return JSON.stringify({
      status: 'success',
      id: id,
      link: getTxExplorerUrl(id),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
