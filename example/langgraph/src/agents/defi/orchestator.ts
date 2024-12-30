import { prompt, parser } from '../../prompts/defi/orchestator.js';
import { RunnableSequence } from '@langchain/core/runnables';
import { model } from '../../utils/model.js';
import { fuelAgentState } from '../../utils/state.js';

const chain = RunnableSequence.from([prompt, model, parser]);

export const orchestatorNode = async (state: typeof fuelAgentState.State) => {
  const messages = state.messages;

  const result = await chain.invoke({
    messages,
    formatInstructions: parser.getFormatInstructions(),
  });

  const { isTransferOrSwap, isBorrowOrSupply, isAddLiquidity } = result;

  return {
    isTransferOrSwap,
    isBorrowOrSupply,
    isAddLiquidity,
  };
};

export async function orchestrator(messages: string) {
  const result = await chain.invoke({
    messages,
    formatInstructions: parser.getFormatInstructions(),
  });

  console.log(result);
}
