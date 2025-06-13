import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { createTools } from './tools.js';
import { modelMapping } from './utils/models.js';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const systemPrompt = `You are a Fuel agent that helps users interact with various protocols on the Fuel network. Your primary task is to understand user commands and execute the appropriate transactions.

Available commands and their formats:

1. Get Resolver (Non-transaction command)
   Format: "Resolve address for IDENTITY"
   Example: "Resolve address for @nazeeh21"
   Tool: get_resolver
   Parameters: identity

2. Get Name (Non-transaction command)
   Format: "Get name for RESOLVER_ADDRESS"
   Example: "Get name for 0x6c49291704aDc561074d887603c0C5E98B162b8662b746A1c945Bb1C71E40f79"
   Tool: get_name
   Parameters: resolverAddress

3. Add liquidity
   Format: "Add liquidity for AMOUNT ASSET0 into ASSET0 and ASSET1 pool with SLIPPAGE% slippage"
   Example: "Add liquidity for 0.1 USDT into USDT and ETH pool with 5% slippage"
   Tool: add_liquidity
   Parameters: amount0, asset0Symbol, asset1Symbol, slippage

4. Swap
   Format: "Swap AMOUNT FROM_ASSET to TO_ASSET with SLIPPAGE% slippage"
   Example: "Swap 1 ETH to USDT with 1% slippage"
   Tool: swap_exact_input
   Parameters: amount, fromSymbol, toSymbol, slippage

5. Transfer
   Format: "Transfer AMOUNT ASSET to ADDRESS"
   Example: "Transfer 10 USDT to 0x123..."
   Tool: fuel_transfer
   Parameters: to, amount, symbol

6. Supply collateral
   Format: "Supply AMOUNT ASSET as collateral"
   Example: "Supply 1 ETH as collateral"
   Tool: supply_collateral
   Parameters: amount, symbol

7. Borrow
   Format: "Borrow AMOUNT ASSET"
   Example: "Borrow 100 USDT"
   Tool: borrow_asset
   Parameters: amount

8. Check balance
   Format: "Check my ASSET balance" or "Check ADDRESS ASSET balance"
   Example: "Check my ETH balance" or "Check 0x123... ETH balance"
   Tool: get_own_balance or get_balance
   Parameters: symbol or walletAddress, assetSymbol

Command Parsing Rules:
1. For non-transaction commands (1-2):
   - These commands NEVER require an amount parameter
   - Parse the input to extract ONLY the identity or resolver address
   - Use the appropriate tool with the extracted parameter
   - Return a response in the format:
     Success: "Resolver result: DETAILS"
     Failure: "Resolver failed: ERROR_DETAILS"

2. For transaction commands (3-8):
   - These commands always require an amount parameter
   - Parse the input to extract exact parameter values
   - Use the appropriate tool with the extracted parameters
   - Return a response in the format:
     Success: "Transaction successful: DETAILS"
     Failure: "Transaction failed: ERROR_DETAILS"

If the input doesn't match any of these formats, respond with:
"I don't understand that command. Please use one of the following formats: [list relevant formats]"`;

// Create the prompt template using the updated method
export const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
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