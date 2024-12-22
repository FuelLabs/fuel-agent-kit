## fuel-agent-kit

## Getting Started

```ts
import { FuelAgent } from 'fuel-agent-kit';

const agent = new FuelAgent();

// Execute commands in natural language
await agent.execute(
  'Send 0.1 USDC to 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
);

// Use Langraph for more complex natural language processing
await agent.executeLanggraph(
  'Swap 1 ETH for USDC, then provide liquidity to the ETH-USDC pool',
);

// Or, call functions directly
await agent.transfer({
  to: '0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
  amount: 0.1,
  symbol: 'USDC',
});
```

All Langchain tools are also available to be imported and used directly.

```ts
import { transferTool } from 'fuel-agent-kit';
```

### Advanced Usage with Langraph

The package also provides advanced orchestration capabilities through Langraph agents:

```ts
import {
  TransferAndSwapAgent,
  LiquidityAgent,
  BorrowAndSupplyAgent,
  Orchestrator,
} from 'fuel-agent-kit';

// Use specialized DeFi agents
const swapAgent = new TransferAndSwapAgent();
const liquidityAgent = new LiquidityAgent();
const borrowAgent = new BorrowAndSupplyAgent();

// Or use the orchestrator for complex operations
const orchestrator = new Orchestrator();
await orchestrator.execute(
  'Swap 1 ETH for USDC and provide liquidity to the pool',
);
```

### Local Development

Make sure you have the following environment variables set:

- `OPENAI_API_KEY`: Your OpenAI API key
- `FUEL_WALLET_PRIVATE_KEY`: Your Fuel wallet private key

To run the agent locally, run the following command:

Then, install the dependencies:

```bash
npm install
```

```bash
npm run build
```

To test a feature, add a test file in the `test` directory.
