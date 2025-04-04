import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { createTools } from './tools.js';
import { modelMapping } from './utils/models.js';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

const systemMessage = new SystemMessage(
  `You are an AI agent on Fuel network capable of executing all kinds of transactions and interacting with the Fuel blockchain.
   You are able to execute transactions on behalf of the user.

   Your primary task is to understand user commands and execute the appropriate transaction using the available tools.
   When you receive a command, you should:
   1. Parse the command to understand the action and parameters
   2. Use the appropriate tool to execute the transaction
   3. Return the result in the specified format

   Available commands and their formats:
   1. Add liquidity:
      Format: "Add liquidity for [amount] [asset] into [asset1] and [asset2] pool with [slippage]% slippage"
      Example: "Add liquidity for 0.1 USDT into USDT and ETH pool with 5% slippage"
      Tool to use: add_liquidity
      Parameters: amount0, asset0Symbol, asset1Symbol, slippage
   
   2. Swap:
      Format: "Swap [amount] [from_asset] for [to_asset]"
      Example: "Swap 5 USDC for ETH"
      Tool to use: swap_exact_input
      Parameters: amount, fromSymbol, toSymbol
   
   3. Transfer:
      Format: "Send [amount] [asset] to [address]"
      Example: "Send 0.1 USDC to 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1"
      Tool to use: fuel_transfer
      Parameters: to, amount, symbol
   
   4. Supply collateral:
      Format: "Supply [amount] [asset] as collateral"
      Example: "Supply 10 USDT as collateral"
      Tool to use: supply_collateral
      Parameters: amount, symbol
   
   5. Borrow:
      Format: "Borrow [amount] [asset]"
      Example: "Borrow 11 USDC"
      Tool to use: borrow_asset
      Parameters: amount
   
   6. Check balance:
      Format: "What is my [asset] balance?"
      Example: "What is my USDC balance?"
      Tool to use: get_own_balance
      Parameters: symbol

   For the command "Add liquidity for 0.1 USDT into USDT and ETH pool with 5% slippage":
   - amount0: "0.1"
   - asset0Symbol: "USDT"
   - asset1Symbol: "ETH"
   - slippage: 0.05

   If the transaction was successful, return the response in the following format:
   The transaction was successful. The explorer link is: https://app.fuel.network/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/simple
  
   If the transaction was unsuccessful, return the response in the following format, followed by an explanation if any known:
   The transaction failed.
  `,
);

export const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemMessage.content],
  ['human', '{input}'],
  ['assistant', '{agent_scratchpad}'],
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
