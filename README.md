# Fuel Agent Monorepo

This monorepo contains the Fuel Agent project, organized using pnpm workspaces for efficient management of multiple packages and applications.

## Structure

- `apps/`: Contains the main applications
- `docs/`: Documentation application
- `packages/`: Contains shared packages
- `fuel-agent-kit/`: Internal package providing AI agent capabilities on the Fuel network

## Getting Started

### 1. Install Dependencies

Run the following command:

```bash
pnpm install
```

### 2. Build All Packages

Run the following command:

```bash
pnpm build
```

### 3. Develop Applications

Run the following command:

```bash
pnpm dev
```

## fuel-agent-kit

The fuel-agent-kit is an internal package that provides tools to build AI agents on the Fuel network.

### Installation

To install the package, run:

```bash
pnpm add fuel-agent-kit fuels
```

### Documentation

Comprehensive documentation is available at:
https://dhaiwatpandya.gitbook.io/fuel-agent-kit/

### Usage

To use the fuel-agent-kit, here's an example:

```typescript
import { FuelAgent } from 'fuel-agent-kit';

const agent = new FuelAgent({
  model: 'gpt-4o-mini',
  openaiApiKey: process.env.OPENAI_API_KEY,
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY,
});

// Execute commands in natural language
await agent.execute('Send 0.1 USDC to 0xRecipientAddress');
```

For more examples and detailed usage, visit the documentation:
https://dhaiwatpandya.gitbook.io/fuel-agent-kit/

## Contributing

Contributions are welcome. Please follow the guidelines outlined in the [CONTRIBUTING.md](https://github.com/0xamogh/fuel-agent-kit/blob/main/CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/0xamogh/fuel-agent-kit/blob/main/LICENSE) file for details.