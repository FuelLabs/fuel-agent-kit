import { END } from '@langchain/langgraph';
import { fuelAgentState } from './state.js';

export const orchestatorRouter = (state: typeof fuelAgentState.State) => {
  if (state.isAddLiquidity) {
    return 'liquidity';
  } else if (state.isBorrowOrSupply) {
    return 'borrowAndSupply';
  } else if (state.isTransferOrSwap) {
    return 'transferAndSwap';
  } else {
    return 'general';
  }
};
