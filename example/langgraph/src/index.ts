import { orchestatorNode } from './agents/defi/orchestator.js';
import { fuelAgentState } from './utils/state.js';
import { END, StateGraph } from '@langchain/langgraph';
import { liquidityNode } from './agents/defi/liquidityAgent.js';
import { transferAndSwapNode } from './agents/defi/transferAndSwapAgent.js';
import { orchestatorRouter } from './utils/router.js';
import { generalNode } from './agents/defi/generalAgent.js';
import { START } from '@langchain/langgraph';
import { borrowAndSupplyNode } from './agents/defi/borrowAndSupplyAgent.js';
import { HumanMessage } from '@langchain/core/messages';

const workflow = new StateGraph(fuelAgentState)
  .addNode('orchestator', orchestatorNode)
  .addNode('borrowAndSupply', borrowAndSupplyNode)
  .addNode('liquidity', liquidityNode)
  .addNode('general', generalNode)
  .addNode('transferAndSwap', transferAndSwapNode)
  .addEdge(START, 'orchestator')
  .addConditionalEdges('orchestator', orchestatorRouter)
  .addEdge('liquidity', END)
  .addEdge('transferAndSwap', END)
  .addEdge('borrowAndSupply', END)
  .addEdge('general', END);

export const graph = workflow.compile();

export const agent = graph.invoke({
  messages: [new HumanMessage('Hello, how are you?')],
});
const example = await graph.invoke({
  messages: [new HumanMessage('Hello, how are you?')],
});

console.log(example);
