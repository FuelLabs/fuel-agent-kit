# LangGraph DeFi Agent Example

This example demonstrates how to build a DeFi agent using LangGraph that can handle various DeFi operations like token transfers, swaps, borrowing, supplying collateral, and adding liquidity.

## Overview

The agent uses a graph-based architecture to route user requests to specialized sub-agents that handle specific DeFi operations:

- **Transfer/Swap Agent**: Handles token transfers and swaps between different assets
- **Borrow/Supply Agent**: Manages borrowing and supplying assets to lending protocols
- **Liquidity Agent**: Handles adding liquidity to pools
- **Orchestrator**: Routes requests to the appropriate agent based on the user's intent

## Project Structure

- `src/index.ts`: Defines the graph structure and connects the agents
- `src/agents/`: Contains the specialized agents for each DeFi operation
- `src/utils/`: Utility functions for interacting with the blockchain and AI services
- `src/messages/`: Custom message types for the LangGraph workflow
- `src/prompts/`: Prompt templates for the agents
- `src/schemas/`: TypeScript types for the workflow data
- `src/setup.ts`: Configuration and setup for the LangGraph workflow
- `src/types.ts`: TypeScript types for the workflow data
- `src/utils/agent.ts`: Utility functions for interacting with the blockchain and AI services
- `src/utils/fuel.ts`: Utility functions for interacting with the Fuel blockchain
- `src/utils/openai.ts`: Utility functions for interacting with the OpenAI API

## Running the Example

To run the example, follow these steps:

1. Install the dependencies:

```bash
pnpm install
```

2. Run the example:

```bash
pnpm run langgraph
```
