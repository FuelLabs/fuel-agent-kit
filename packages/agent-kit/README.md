# fuel-agent-kit (alpha)

Docs: https://dhaiwatpandya.gitbook.io/fuel-agent-kit/

## Getting Started

```bash
npm install fuel-agent-kit fuels
```

You will need two things:

- A Fuel wallet private key
- An OpenAI or Gemini or Anthropic API key

```ts
import { FuelAgent } from 'fuel-agent-kit';

const agent = new FuelAgent({
  model: 'gpt-4o-mini',
  openaiApiKey: process.env.OPENAI_API_KEY,
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY,
});

// Call different functions
await agent.transfer({
  to: '0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
  amount: 0.1,
  symbol: 'USDC',
});

// or, execute commands in natural language
await agent.execute(
  'Send 0.1 USDC to 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
);

// Swap Assets
await agent.execute('Swap 5 USDC for ETH');

// Add Liqudity
await agent.execute(
  'Add liquidity into USDC/USDT pool for 0.1 USDC with 5% slippage',
);

// Lend Assets
await agent.execute('Supply 10 USDT as Collateral');

// Borrow Assets
await agent.execute('Borrow 11 USDC');
```

All Langchain tools are also available to be imported and used directly.

```ts
import { transferTool } from 'fuel-agent-kit';
```

### Local Development

Make sure you have the following environment variables set:

- `OPENAI_API_KEY`: Your OpenAI API key (or `GOOGLE_GEMINI_API_KEY` or `ANTHROPIC_API_KEY`)
- `FUEL_WALLET_PRIVATE_KEY`: Your Fuel wallet private key

To run the project locally, run the following command:

Then, install the dependencies:

```bash
npm install
```

```bash
npm run build
```

To test a feature, add a test file in the `test` directory.
