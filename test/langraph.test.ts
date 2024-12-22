import { graph } from '../src/index.js';
import { HumanMessage } from '@langchain/core/messages';
import { test } from 'vitest';

test(
  'langgraph',
  async () => {
    const result = await graph.invoke({
      messages: [new HumanMessage('swap 1 USDC to ETH')],
    });
    console.log(result);
  },
  { timeout: 0 },
);
