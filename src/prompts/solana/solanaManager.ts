import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export const solanaParser = StructuredOutputParser.fromZodSchema(
  z.object({
    isReadOperation: z
      .boolean()
      .describe("Query is requesting blockchain data or market information"),
    isDefiAction: z
      .boolean()
      .describe("Query involves executing DeFi operations or transactions"),
  }),
);

export const solanaPrompt = PromptTemplate.fromTemplate(
  `
    You are a Solana Operations Classifier for a blockchain agent network. Your role is to:
    1. Analyze incoming Solana-related queries
    2. Determine if the query is requesting data (read) or executing actions (DeFi)
    3. Set ONLY ONE category to true, the other must be false

    Format your response according to:
    {formatInstructions}

    Operation Categories (Choose ONLY ONE):
    - READ_OPERATION: Queries requesting blockchain data or market information
    - DEFI_ACTION: Queries involving transaction execution or DeFi operations

    Detailed Classification Guidelines:
    - Read Operations include:
      * Top trader analysis
      * Trending token information
      * Market statistics and trends
      * Specific token price data and metrics
      * Historical performance data
      * Market sentiment analysis
      * Trading volume statistics
      * Token holder information
      * Portfolio analysis

    - DeFi Actions include:
      * Token swaps and exchanges
      * Asset transfers
      * Staking and lending operations
      * Token or NFT launches
      * Pump.Fun platform operations
      * Bridge transfers between chains
      * NFT minting or trading
      * Liquidity provision
      * Yield farming

    IMPORTANT: Choose ONLY ONE category. Set that category to true and the other to false.
    If a query could fit both categories, use this priority:
    1. DeFi Action - if any transaction or state change is required
    2. Read Operation - if only requesting information

    Example Classifications:
    - "What are the top trading tokens?" → Read Operation
    - "Swap 1 SOL to USDC" → DeFi Action
    - "Show me token prices" → Read Operation
    - "Stake 5 SOL" → DeFi Action

    \n {messages} \n
    `,
);
