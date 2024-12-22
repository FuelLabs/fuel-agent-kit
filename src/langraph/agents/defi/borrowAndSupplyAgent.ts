import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { model } from '../../../agent.js';
import { borrowAndSupplyPrompt } from '../../prompts/defi/borrowAndSupply.js';
import { borrowAssetTool, supplyCollateralTool } from '../../../tools.js';
import { HumanMessage } from '@langchain/core/messages';
import { fuelAgentState } from '../../utils/state.js';
export const borrowAndSupplyGraph = createReactAgent({
  llm: model,
  tools: [borrowAssetTool, supplyCollateralTool],
  stateModifier: borrowAndSupplyPrompt,
});

export const borrowAndSupplyNode = async (
  state: typeof fuelAgentState.State,
) => {
  const messages = state.messages;

  const result = await borrowAndSupplyGraph.invoke({
    messages,
  });

  return { messages: [...result.messages] };
};

export const borrowAndSupplyAgent = async (messages: string) => {
  const agent = await borrowAndSupplyGraph.invoke({
    messages: [new HumanMessage(messages)],
  });

  console.log(agent);
};
