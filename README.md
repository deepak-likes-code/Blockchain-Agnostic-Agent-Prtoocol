# Solgent - Solana AI Agent Platform

[![CI](https://github.com/langchain-ai/new-langgraphjs-project/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/langchain-ai/new-langgraphjs-project/actions/workflows/unit-tests.yml)
[![Integration Tests](https://github.com/langchain-ai/new-langgraphjs-project/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/langchain-ai/new-langgraphjs-project/actions/workflows/integration-tests.yml)

Solgent is an AI-powered agent platform for Solana blockchain interactions, built using LangGraph.js. It provides a comprehensive suite of tools for DeFi operations, market analysis, and blockchain interactions.

## Features

### DeFi Operations

- **Token Swaps**: Execute token swaps using Jupiter Exchange
- **Token Transfers**: Send tokens between Solana wallets
- **Cross-Chain Bridging**: Bridge assets between Solana, Base, and other chains using Wormhole
- **Lending & Staking**:
  - Stake SOL tokens on Jupiter protocol
  - Lend USDC on Lulo protocol
- **Token Creation**: Launch meme coins and tokens using Pump.Fun

### Market Analytics

- **Top Traders Analysis**: Track and analyze top-performing traders
- **Trending Tokens**: Monitor trending tokens and market movements
- **Market Statistics**: Access comprehensive market data and trends

### Architecture

The platform uses a multi-agent system with specialized components:

- **Chief Router**: Main entry point that classifies and routes queries
- **DeFi Manager**: Handles all DeFi-related operations
- **Read Manager**: Processes market data and analytics requests
- **Generalist**: Handles general blockchain queries
- **Specialized Agents**: Dedicated agents for specific tasks (bridging, lending, etc.)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- Yarn package manager
- Required API keys:
  - Solana RPC endpoint
  - OpenAI API key
  - Anthropic API key (optional)
  - Birdeye API key
  - Lulo API key (for lending features)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd solgent
```

2. Install dependencies:

```bash
yarn install
```

3. Create and configure environment variables:

```bash
cp .env.example .env
```

Required environment variables:

```
SOLANA_PRIVATE_KEY=
SOLANA_MAINNET_RPC=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
BIRDEYE_API_KEY=
LULO_API_KEY=
```

### Usage

The platform can be used through the LangGraph Studio interface or programmatically:

```typescript
import { graph } from "./src/index";

const result = await graph.invoke({
  messages: [new HumanMessage("swap 1 USDC to SOL")],
});
```

## Examples

### Token Swap

```typescript
const swapMessage = {
  messages: [new HumanMessage("swap 1 USDC to SOL")],
};
```

### Token Transfer

```typescript
const transferMessage = {
  messages: [
    new HumanMessage(
      "transfer 1000 BONK to DZbJiJ2Uiwe3g53KBhJZ4ftdcUJGaVZNyp1ua2saguXC",
    ),
  ],
};
```

### Create Meme Token

```typescript
const pumpFun = {
  messages: [
    new HumanMessage(
      "mint a meme coin called catsAreGods with the ticker $CATGOD",
    ),
  ],
};
```

## Development

### Project Structure

```
src/
├── agent/         # Agent implementations
├── prompts/       # System prompts and templates
├── router/        # Routing logic
├── tools/         # DeFi and analytics tools
└── utils/         # Utility functions and configurations
```

### Running Tests

```bash
# Unit tests
yarn test

# Integration tests
yarn test:int

# All tests and linting
yarn test:all
```

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [LangGraph.js](https://github.com/langchain-ai/langgraphjs)
- Uses [Solana Agent Kit](https://github.com/solana-labs/solana-agent-kit)
- Integrates with Jupiter, Lulo, and Pump.Fun protocols
