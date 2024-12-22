import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { PromptTemplate } from '@langchain/core/prompts';

export const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    isTransferOrSwap: z
      .boolean()
      .describe('Query involves token transfers or swaps between assets'),
    isBorrowOrSupply: z
      .boolean()
      .describe(
        'Query involves borrowing assets from or supplying assets to a lending protocol',
      ),
    isAddLiquidity: z
      .boolean()
      .describe('Query involves adding liquidity to a pool or protocol'),
  }),
);

export const prompt = PromptTemplate.fromTemplate(`
You are the Chief Orchestrator for a DeFi operations network. Your role is to:
1. Analyze user queries about DeFi operations
2. Classify them into appropriate action categories

Format your response according to:
{formatInstructions}

Action Categories and their definitions:
- TRANSFER/SWAP: Handles token transfers and swaps between different assets
- BORROW/SUPPLY: Manages borrowing from or supplying assets to lending protocols
- ADD LIQUIDITY: Manages adding liquidity to pools or protocols

Classification Guidelines:
- Transfer/Swap queries include: sending tokens, exchanging tokens, converting between assets
- Borrow/Supply queries include: taking loans, borrowing tokens, depositing assets as collateral, providing backing for loans
- Add Liquidity queries include: providing liquidity to pools, staking in liquidity pools

Example queries for each category:
Transfer/Swap: "How do I swap SOL for USDC?", "Can I transfer tokens between wallets?"
Borrow/Supply: "Can I borrow USDC against my SOL?", "How to deposit assets for lending?", "I want to supply SOL as collateral"
Add Liquidity: "How do I provide liquidity to a pool?", "Can I stake my tokens in an LP?"

{messages}
`);
