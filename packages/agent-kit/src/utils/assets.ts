import { CHAIN_IDS, type Asset, type NetworkFuel } from 'fuels';

interface CacheData {
  timestamp: number;
  data: Asset[];
}

// In-memory cache
let assetsCache: CacheData | null = null;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds

export const getVerifiedAssets = async () => {
  // Check if we have valid cache
  if (assetsCache && Date.now() - assetsCache.timestamp < CACHE_TTL) {
    return assetsCache.data;
  }

  // Fetch fresh data
  const allAssets = (await fetch(
    'https://verified-assets.fuel.network/assets.json',
  ).then((res) => res.json())) as Asset[];

  // Update cache
  assetsCache = {
    timestamp: Date.now(),
    data: allAssets,
  };

  return allAssets;
};

export const getAssetIdAndDecimals = async (
  symbol: string,
  assets: Asset[],
) => {
  const asset = assets.find((asset) => asset.symbol === symbol);
  if (!asset) {
    throw new Error(`Asset ${symbol} not found`);
  }
  const networks = asset.networks;

  const fuelNetworkIndex = networks.findIndex(
    (network) =>
      network.type === 'fuel' && network.chainId === CHAIN_IDS.fuel.mainnet,
  );

  if (fuelNetworkIndex === -1) {
    throw new Error(`Asset ${symbol} not found on Fuel`);
  }

  return {
    assetId: (asset.networks[fuelNetworkIndex] as NetworkFuel).assetId,
    decimals: (asset.networks[fuelNetworkIndex] as NetworkFuel).decimals,
  };
};

export const getAllVerifiedSymbols = async (assets: Asset[]) => {
  return assets.map((asset) => asset.symbol);
};

export type FuelAgentAsset = {
  symbol: string;
  assetId: string;
  decimals: number;
};

export const getAllVerifiedFuelAssets = async () => {
  const allAssets = await getVerifiedAssets();
  const symbols = await getAllVerifiedSymbols(allAssets);
  const assets: FuelAgentAsset[] = [];

  for await (const symbol of symbols) {
    const { assetId, decimals } = await getAssetIdAndDecimals(
      symbol,
      allAssets,
    );
    assets.push({
      symbol,
      assetId,
      decimals,
    });
  }

  return assets;
};
