import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { model } from '../../../agent.js';
import { transferAndSwapPrompt } from '../../prompts/defi/transferAndSwap.js';
import { transferTool, swapExactInputTool } from '../../../tools.js';
import { HumanMessage } from '@langchain/core/messages';

export const transferAndSwapGraph = createReactAgent({
  llm: model,
  tools: [transferTool, swapExactInputTool],
  stateModifier: transferAndSwapPrompt,
});

// const messages = [new HumanMessage('transfer 100 USDC to eth')];

export const transferAndSwapAgent = async (messages: string) => {
  const agent = await transferAndSwapGraph.invoke({
    messages: [new HumanMessage(messages)],
  });
  console.log(agent);
};
