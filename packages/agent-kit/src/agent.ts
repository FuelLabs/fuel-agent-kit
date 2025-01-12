import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { createTools } from './tools.js';
import { modelMapping } from './utils/models.js';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage } from '@langchain/core/messages';

const systemMessage = new SystemMessage(
  ` You are an AI agent on Fuel network capable of executing all kinds of transactions and interacting with the Fuel blockchain.
    You are able to execute transactions on behalf of the user.

    If the transaction was successful, return the response in the following format:
    The transaction was successful. The explorer link is: https://app.fuel.network/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/simple
  
    If the transaction was unsuccessful, return the response in the following format, followed by an explanation if any known:
    The transaction failed.
  `,
);

export const prompt = ChatPromptTemplate.fromMessages([
  systemMessage,
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

export const createAgent = (
  fuelAgent: { getCredentials: () => { walletPrivateKey: string } },
  modelName: keyof typeof modelMapping,
  openAiApiKey?: string,
  anthropicApiKey?: string,
  googleGeminiApiKey?: string,
) => {
  const model = () => {
    if (modelMapping[modelName] === 'openai') {
      if (!openAiApiKey) {
        throw new Error('OpenAI API key is required');
      }
      return new ChatOpenAI({
        modelName: modelName,
        apiKey: openAiApiKey,
      });
    }
    if (modelMapping[modelName] === 'anthropic') {
      if (!anthropicApiKey) {
        throw new Error('Anthropic API key is required');
      }
      return new ChatAnthropic({
        modelName: modelName,
        anthropicApiKey: anthropicApiKey,
      });
    }
    if (modelMapping[modelName] === 'gemini') {
      if (!googleGeminiApiKey) {
        throw new Error('Google Gemini API key is required');
      }
      return new ChatGoogleGenerativeAI({
        modelName: modelName,
        apiKey: googleGeminiApiKey,
        convertSystemMessageToHumanContent: true,
      });
    }
  };

  const selectedModel = model();

  if (!selectedModel) {
    throw new Error('Error initializing model');
  }

  const tools = createTools(fuelAgent);

  const agent = createToolCallingAgent({
    llm: selectedModel,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
  });
};
