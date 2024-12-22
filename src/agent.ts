import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { tools } from './tools.js';

export const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are an AI agent on Fuel network capable of executing all kinds of transactions and interacting with the Fuel blockchain.',
  ],
  [
    'system',
    `Always return the response in the following format:
      The transaction was successful/failed. The explorer link is: https://app.fuel.network/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/simple
    `,
  ],
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

export const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  apiKey: process.env.OPENAI_API_KEY,
});

export const getModel = () => {
  const boundModel = model.bindTools(tools);
  return boundModel;
};

export const agent = createToolCallingAgent({
  llm: new ChatOpenAI({
    modelName: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  }),
  tools,
  prompt,
});

export const agentExector = new AgentExecutor({
  agent,
  tools,
});
