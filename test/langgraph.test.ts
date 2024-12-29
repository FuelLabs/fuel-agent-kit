import { describe, it, expect, test } from 'vitest';
import { graph } from '../example/langgraph/src/index.js';
import { HumanMessage } from '@langchain/core/messages';

describe('LangGraph Workflow', () => {
  it('should process a message through the workflow', async () => {
    const result = await graph.invoke({
      messages: [
        new HumanMessage('I want to check liquidity for ETH on Uniswap'),
      ],
    });

    expect(result).toBeDefined();
    expect(result.messages).toBeDefined();
    expect(Array.isArray(result.messages)).toBe(true);
  });
});

test(
  'langgraph',
  async () => {
    const result = await graph.invoke({
      messages: [
        new HumanMessage(
          'transfer 100 usdc to 0x651C910D48A3fCB5a2503041dE64B1df418d5142f9B56291a444950f77e0fc90',
        ),
      ],
    });
    console.log(result);
  },
  { timeout: 0 },
);
