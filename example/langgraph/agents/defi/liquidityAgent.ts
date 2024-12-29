import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { model } from '../../agent.js';
import { liquidityPrompt } from '../../prompts/defi/liquidity.js';
import { addLiquidityTool } from '../../tools/defi/tools.js';
import { HumanMessage } from '@langchain/core/messages';
import { fuelAgentState } from '../../utils/state.js';
export const liquidityGraph = createReactAgent({
  llm: model,
  tools: [addLiquidityTool],
  stateModifier: liquidityPrompt,
});

export const liquidityNode = async (state: typeof fuelAgentState.State) => {
  const messages = state.messages;

  const result = await liquidityGraph.invoke({
    messages,
  });

  return { messages: [...result.messages] };
};

export const liquidityAgent = async (messages: string) => {
  const agent = await liquidityGraph.invoke({
    messages: [new HumanMessage(messages)],
  });
  console.log(agent);
};
