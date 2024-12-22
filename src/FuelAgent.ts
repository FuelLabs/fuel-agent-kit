import { agentExector } from './agent.js';
import { addLiquidity, type AddLiquidityParams } from './mira/addLiquidity.js';
import { swapExactInput, type SwapExactInputParams } from './mira/swap.js';
import { borrowAsset, type BorrowAssetParams } from './swaylend/borrow.js';
import { graph } from './langraph/index.js';
import { HumanMessage } from '@langchain/core/messages';
import {
  supplyCollateral,
  type SupplyCollateralParams,
} from './swaylend/supply.js';
import {
  transfer as walletTransfer,
  type TransferParams,
} from './transfers/transfers.js';

export class FuelAgent {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    if (!process.env.FUEL_WALLET_PRIVATE_KEY) {
      throw new Error('FUEL_WALLET_PRIVATE_KEY is not set');
    }
  }

  async exceuteLanggraph(input: string) {
    const response = await graph.invoke({
      messages: [new HumanMessage(input)],
    });

    return response;
  }

  async execute(input: string) {
    const response = await agentExector.invoke({
      input,
    });

    return response;
  }

  async swapExactInput(params: SwapExactInputParams) {
    return await swapExactInput(params);
  }

  async transfer(params: TransferParams) {
    return await walletTransfer(params);
  }

  async supplyCollateral(params: SupplyCollateralParams) {
    return await supplyCollateral(params);
  }

  async borrowAsset(params: BorrowAssetParams) {
    return await borrowAsset(params);
  }

  async addLiquidity(params: AddLiquidityParams) {
    return await addLiquidity(params);
  }
}
