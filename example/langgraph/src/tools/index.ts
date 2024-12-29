import { agent } from '../utils/agent.js';
import {
  createTransferTool,
  createSwapTool,
  createSupplyCollateralTool,
  createBorrowAssetTool,
  createAddLiquidityTool,
  createGetOwnBalanceTool,
} from '../../../../src/tools.js';

// Export individual tools for direct use in agents
export const transferTool = createTransferTool(agent);
export const swapExactInputTool = createSwapTool(agent);
export const supplyCollateralTool = createSupplyCollateralTool(agent);
export const borrowAssetTool = createBorrowAssetTool(agent);
export const addLiquidityTool = createAddLiquidityTool(agent);
export const getOwnBalanceTool = createGetOwnBalanceTool(agent);
