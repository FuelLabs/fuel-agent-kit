import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { model } from '../../../agent.js';
import { borrowAndSupplyPrompt } from '../../prompts/defi/borrowAndSupply.js';
import { borrowAssetTool, supplyCollateralTool } from '../../../tools.js';
import { HumanMessage } from '@langchain/core/messages';

export const borrowAndSupplyGraph = createReactAgent({
  llm: model,
  tools: [borrowAssetTool, supplyCollateralTool],
  stateModifier: borrowAndSupplyPrompt,
});

export const borrowAndSupplyAgent = async (messages: string) => {
  const agent = await borrowAndSupplyGraph.invoke({
    messages: [new HumanMessage(messages)],
  });

  console.log(agent);
};
