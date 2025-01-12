import { arrayify, bn, DateTime, Provider, Wallet } from 'fuels';
import { Market, type PriceDataUpdateInput } from '../types/Market.js';
import { getAllVerifiedFuelAssets } from '../utils/assets.js';
import { PythContract } from '@pythnetwork/pyth-fuel-js';
import { HermesClient } from '@pythnetwork/hermes-client';
import { setupWallet } from '../utils/setup.js';
import { getTxExplorerUrl } from '../utils/explorer.js';

export type BorrowAssetParams = {
  amount: string;
};

export const borrowAsset = async (
  params: BorrowAssetParams,
  privateKey: string,
) => {
  try {
    const { wallet, provider } = await setupWallet(privateKey);

    const marketContractId =
      '0x657ab45a6eb98a4893a99fd104347179151e8b3828fd8f2a108cc09770d1ebae';
    const marketContract: Market = new Market(marketContractId, wallet);

    const allAssets = await getAllVerifiedFuelAssets();
    const asset = allAssets.find((asset) => asset.symbol === 'USDC'); // We can only borrow USDC
    const assetId: any = asset?.assetId;

    const weiAmount = bn.parseUnits(params.amount, asset?.decimals);

    // fetch configs
    const { value: marketConfiguration } = await marketContract.functions
      .get_market_configuration()
      .get();

    const { value: collateralConfigurations } = await marketContract.functions
      .get_collateral_configurations()
      .get();

    const priceFeedAssets: Map<string, string> = new Map();

    priceFeedAssets.set(
      marketConfiguration.base_token_price_feed_id,
      marketConfiguration.base_token.bits,
    );

    // fetch oracle data from pyth
    for (const [assetId, collateralConfiguration] of Object.entries(
      collateralConfigurations,
    )) {
      priceFeedAssets.set(collateralConfiguration.price_feed_id, assetId);
    }

    const priceFeedIds = Array.from(priceFeedAssets.keys());

    const client = new HermesClient('https://hermes.pyth.network');

    const priceUpdates: any = await client.getLatestPriceUpdates(priceFeedIds);

    const buffer = Buffer.from(priceUpdates.binary.data[0], 'hex');
    const updateData = [arrayify(buffer)];

    const pythContract = new PythContract(
      '0x1c86fdd9e0e7bc0d2ae1bf6817ef4834ffa7247655701ee1b031b52a24c523da',
      wallet,
    );

    // fetch oracle fee
    const { value: fee } = await marketContract.functions
      .update_fee(updateData)
      .addContracts([pythContract])
      .get();

    // before initiating the borrow make sure the wallet has some small amount of USDC for the oracle fee
    const priceUpdateData: PriceDataUpdateInput = {
      update_fee: fee,
      publish_times: priceUpdates.parsed.map((parsedPrice: any) =>
        DateTime.fromUnixSeconds(parsedPrice.price.publish_time).toTai64(),
      ),
      price_feed_ids: priceFeedIds,
      update_data: updateData,
    };

    const { waitForResult } = await marketContract.functions
      .withdraw_base((+params.amount).toFixed(0), priceUpdateData)
      .callParams({
        forward: {
          amount: fee,
          assetId: provider.getBaseAssetId(),
        },
      })
      .addContracts([pythContract])
      .call();

    // Wait for the transaction to complete
    const transactionResult = await waitForResult();

    // Return the transaction ID
    return JSON.stringify({
      status: 'success',
      id: transactionResult.transactionId,
      link: getTxExplorerUrl(transactionResult.transactionId),
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
