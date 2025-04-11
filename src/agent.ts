import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { createTools } from './tools.js';
import { modelMapping } from './utils/models.js';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

const systemMessage = new SystemMessage(`You are a Fuel agent that helps users interact with various protocols on the Fuel network. Your primary task is to understand user commands and execute the appropriate transactions.

Available commands and their formats:

1. Add liquidity
   Format: "Add liquidity for {amount} {asset0} into {asset0} and {asset1} pool with {slippage}% slippage"
   Example: "Add liquidity for 0.1 USDT into USDT and ETH pool with 5% slippage"
   Tool: add_liquidity
   Parameters: amount0, asset0Symbol, asset1Symbol, slippage

2. Swap
   Format: "Swap {amount} {fromAsset} to {toAsset} with {slippage}% slippage"
   Example: "Swap 1 ETH to USDT with 1% slippage"
   Tool: swap_exact_input
   Parameters: amount, fromSymbol, toSymbol, slippage

3. Transfer
   Format: "Transfer {amount} {asset} to {address}"
   Example: "Transfer 10 USDT to 0x123..."
   Tool: fuel_transfer
   Parameters: to, amount, symbol

4. Supply collateral
   Format: "Supply {amount} {asset} as collateral"
   Example: "Supply 1 ETH as collateral"
   Tool: supply_collateral
   Parameters: amount, symbol

5. Borrow
   Format: "Borrow {amount} {asset}"
   Example: "Borrow 100 USDT"
   Tool: borrow_asset
   Parameters: amount

6. Check balance
   Format: "Check my {asset} balance" or "Check {address} {asset} balance"
   Example: "Check my ETH balance" or "Check 0x123... ETH balance"
   Tool: get_own_balance or get_balance
   Parameters: symbol or walletAddress, assetSymbol

7. Bako Resolver (Non-transaction commands)
   Format: "Resolve address for {identity}" or "Get id for {resolverAddress}"
   Example: "Resolve address for bako.id/example" or "Get id for 0x123..."
   Tool: get_resolver or get_name
   Parameters: identity or resolverAddress

Command Parsing Rules:
1. For transaction commands (1-6):
   - These commands always require an amount parameter
   - Parse the input to extract exact parameter values
   - Use the appropriate tool with the extracted parameters
   - Return a response in the format:
     Success: "Transaction successful: {details}"
     Failure: "Transaction failed: {error details}"

2. For Bako resolver commands (7):
   - These commands NEVER require an amount parameter
   - Parse the input to extract ONLY the identity or resolver address
   - Use the appropriate tool with the extracted parameter
   - Return a response in the format:
     Success: "Resolver result: {details}"
     Failure: "Resolver failed: {error details}"

If the input doesn't match any of these formats, respond with:
"I don't understand that command. Please use one of the following formats: [list relevant formats]"
`);

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
