import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { model } from '../../utils/model.js';
import { transferAndSwapPrompt } from '../../prompts/defi/transferAndSwap.js';
import { transferTool, swapExactInputTool } from '../../tools/index.js';
import { HumanMessage } from '@langchain/core/messages';
import { fuelAgentState } from '../../utils/state.js';
import { Tool, tool } from '@langchain/core/tools';
export const transferAndSwapGraph = createReactAgent({
  llm: model,
  tools: [transferTool],
  stateModifier: transferAndSwapPrompt,
});

export const transferAndSwapNode = async (
  state: typeof fuelAgentState.State,
) => {
  const messages = state.messages;

  const result = await transferAndSwapGraph.invoke({
    messages,
  });

  return { messages: [...result.messages] };
};

// const messages = [new HumanMessage('transfer 100 USDC to eth')];

export const transferAndSwapAgent = async (messages: string) => {
  const agent = await transferAndSwapGraph.invoke({
    messages: [new HumanMessage(messages)],
  });
  console.log(agent);
};
