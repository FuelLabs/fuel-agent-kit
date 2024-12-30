import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { fuelAgentState } from '../../utils/state.js';
import { model } from '../../utils/model.js';
import { HumanMessage } from '@langchain/core/messages';

const generalGraph = createReactAgent({
  llm: model,
  tools: [],
});

export const generalNode = async (state: typeof fuelAgentState.State) => {
  const messages = state.messages;

  const result = await generalGraph.invoke({
    messages,
  });

  return { messages: [...result.messages] };
};
