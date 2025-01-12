import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// Import functions
import { swapExactInput } from './mira/swap.js';
import { transfer } from './transfers/transfers.js';
import { supplyCollateral } from './swaylend/supply.js';
import { borrowAsset } from './swaylend/borrow.js';
import { addLiquidity } from './mira/addLiquidity.js';
import { getBalance, getOwnBalance } from './read/balance.js';

// Types
type FuelAgentInterface = {
  getCredentials: () => { walletPrivateKey: string };
};

/**
 * Wraps a function to inject the wallet private key from the agent
 * @param fn - The function to wrap
 * @param agent - The FuelAgent instance containing credentials
 */
const withWalletKey = <T>(
  fn: (params: T, privateKey: string) => Promise<any>,
  agent: FuelAgentInterface,
) => {
  return (params: T) => fn(params, agent.getCredentials().walletPrivateKey);
};

// Schema definitions
const transferSchema = z.object({
  to: z.string().describe('The wallet address to transfer to'),
  amount: z.string().describe('The amount to transfer'),
  symbol: z.string().describe('The asset symbol to transfer. eg. USDC, ETH'),
});

const swapSchema = z.object({
  amount: z.string().describe('The amount to swap'),
  fromSymbol: z
    .string()
    .describe('The asset symbol to swap from. eg. USDC, ETH'),
  toSymbol: z.string().describe('The asset symbol to swap to. eg. USDC, ETH'),
  slippage: z
    .number()
    .optional()
    .describe('Slippage tolerance (default: 0.01 for 1%)'),
});

const supplyCollateralSchema = z.object({
  amount: z.string().describe('The amount to lend'),
  symbol: z.string().describe('The asset symbol to lend. eg. USDC, ETH'),
});

const borrowAssetSchema = z.object({
  amount: z.string().describe('The amount to borrow'),
});

const addLiquiditySchema = z.object({
  amount0: z.string().describe('The amount of the first asset to add'),
  asset0Symbol: z.string().describe('The symbol of the first asset'),
  asset1Symbol: z.string().describe('The symbol of the second asset'),
  slippage: z
    .number()
    .optional()
    .describe('Slippage tolerance (default: 0.01 for 1%)'),
});

const getOwnBalanceSchema = z.object({
  symbol: z
    .string()
    .describe('The asset symbol to get the balance of. eg. USDC, ETH'),
});

const getBalanceSchema = z.object({
  walletAddress: z
    .string()
    .describe('The wallet address to get the balance of'),
  assetSymbol: z
    .string()
    .describe('The asset symbol to get the balance of. eg. USDC, ETH'),
});

/**
 * Creates and returns all tools with injected agent credentials
 */
export const createTools = (agent: FuelAgentInterface) => [
  tool(withWalletKey(transfer, agent), {
    name: 'fuel_transfer',
    description: 'Transfer any verified Fuel asset to another wallet',
    schema: transferSchema,
  }),

  tool(withWalletKey(swapExactInput, agent), {
    name: 'swap_exact_input',
    description: 'Swap exact input on Mira',
    schema: swapSchema,
  }),

  tool(withWalletKey(supplyCollateral, agent), {
    name: 'supply_collateral',
    description: 'Supply collateral on swaylend',
    schema: supplyCollateralSchema,
  }),

  tool(withWalletKey(borrowAsset, agent), {
    name: 'borrow_asset',
    description: 'Borrow asset on swaylend',
    schema: borrowAssetSchema,
  }),

  tool(withWalletKey(addLiquidity, agent), {
    name: 'add_liquidity',
    description: 'Add liquidity to a Mira pool',
    schema: addLiquiditySchema,
  }),

  tool(withWalletKey(getOwnBalance, agent), {
    name: 'get_own_balance',
    description: 'Get the balance of an asset in your wallet',
    schema: getOwnBalanceSchema,
  }),

  tool(getBalance, {
    name: 'get_balance',
    description: 'Get the balance of an asset for a given wallet address',
    schema: getBalanceSchema,
  }),

  tool( stakeFuel, {
    name: 'stake_fuel',
    description: 'Stake Fuel to tokens',
    schema: getBalanceSchema
  }

  )
];
