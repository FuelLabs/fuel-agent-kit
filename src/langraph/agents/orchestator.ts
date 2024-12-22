import { prompt, parser } from '../prompts/orchestator.js';
import { RunnableSequence } from '@langchain/core/runnables';
import { model } from '../../agent.js';
import { HumanMessage } from '@langchain/core/messages';

const chain = RunnableSequence.from([prompt, model, parser]);

const messages = new HumanMessage('swap usdc to eth');

export async function orchestrator(messages: string) {
  const result = await chain.invoke({
    messages,
    formatInstructions: parser.getFormatInstructions(),
  });

  console.log(result);
}
