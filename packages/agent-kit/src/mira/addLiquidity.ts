import { bn, Provider } from 'fuels';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { buildPoolId, MiraAmm, ReadonlyMiraAmm } from 'mira-dex-ts';
import { setupWallet } from '../utils/setup.js';
import { DEFAULT_SLIPPAGE } from '../constants.js';

async function futureDeadline(provider: Provider) {
  const block = await provider.getBlock('latest');
  return block?.height.add(1000) ?? 1000000000;
}

export type AddLiquidityParams = {
  amount0: string;
  asset0Symbol: string;
  asset1Symbol: string;
  slippage?: number;
};

export const addLiquidity = async (
  params: AddLiquidityParams,
  privateKey: string,
) => {
  try {
    const { wallet, provider } = await setupWallet(privateKey);
    const assets = await getAllVerifiedFuelAssets();

    const asset0 = assets.find((asset) => asset.symbol === params.asset0Symbol);
    const asset1 = assets.find((asset) => asset.symbol === params.asset1Symbol);

    if (!asset0 || !asset1) {
      throw new Error(
        `Asset ${params.asset0Symbol} or ${params.asset1Symbol} not found`,
      );
    }

    let isStable =
      asset0.symbol.includes('USD') && asset1.symbol.includes('USD');
    const asset0Id = asset0.assetId;
    const asset1Id = asset1.assetId;

    if (!asset0Id || !asset1Id) {
      throw new Error('Invalid asset IDs');
    }

    const asset0Decimals = asset0.decimals;
    const asset1Decimals = asset1.decimals;

    if (
      typeof asset0Decimals !== 'number' ||
      typeof asset1Decimals !== 'number'
    ) {
      throw new Error('Invalid asset decimals');
    }

    const amount0InWei = bn.parseUnits(params.amount0, asset0Decimals);

    const poolId = buildPoolId(asset0Id, asset1Id, isStable);

    const miraAmm = new MiraAmm(wallet);
    const miraAmmReader = new ReadonlyMiraAmm(provider);
    const deadline = await futureDeadline(provider);

    // Calculate the required amount1 based on amount0
    const result = await miraAmmReader.getAmountsOut(
      { bits: asset0Id },
      amount0InWei,
      [poolId],
    );

    if (!result || result.length === 0 || !result[0] || result[0].length < 2) {
      throw new Error('Failed to calculate amount1');
    }

    let amount1InWei;
    if (result[1] && result[1][0].bits === asset1Id) {
      amount1InWei = result[1][1];
    } else if (result[0][0].bits === asset1Id) {
      amount1InWei = result[0][1];
    }

    if (!amount1InWei) {
      throw new Error('Failed to calculate amount1');
    }

    // Calculate minimum amounts with slippage
    const minAmount0 = amount0InWei
      .mul(bn(100 - Math.floor((params.slippage || DEFAULT_SLIPPAGE) * 100)))
      .div(bn(100));
    const minAmount1 = amount1InWei
      .mul(bn(100 - Math.floor((params.slippage || DEFAULT_SLIPPAGE) * 100)))
      .div(bn(100));

    const req = await miraAmm.addLiquidity(
      poolId,
      amount0InWei,
      amount1InWei,
      minAmount0,
      minAmount1,
      deadline,
      {
        gasLimit: 1000000,
        maxFee: 1000000,
      },
    );

    const tx = await wallet.sendTransaction(req);

    const { id, status } = await tx.waitForResult();

    return {
      status,
      id,
    };
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
