import { orchestatorNode } from './agents/orchestator.js';
import { fuelAgentState } from './utils/state.js';
import { END, StateGraph } from '@langchain/langgraph';
import { borrowAndSupplyNode } from './agents/defi/borrowAndSupplyAgent.js';
import { liquidityNode } from './agents/defi/liquidityAgent.js';
import { transferAndSwapNode } from './agents/defi/transferAndSwapAgent.js';
import { orchestatorRouter } from './utils/router.js';
import { START } from '@langchain/langgraph';

const workflow = new StateGraph(fuelAgentState)
  .addNode('orchestator', orchestatorNode)
  .addNode('borrowAndSupply', borrowAndSupplyNode)
  .addNode('liquidity', liquidityNode)
  .addNode('transferAndSwap', transferAndSwapNode)
  .addEdge(START, 'orchestator')
  .addConditionalEdges('orchestator', orchestatorRouter)
  .addEdge('liquidity', END)
  .addEdge('transferAndSwap', END)
  .addEdge('borrowAndSupply', END);

export const graph = workflow.compile();
