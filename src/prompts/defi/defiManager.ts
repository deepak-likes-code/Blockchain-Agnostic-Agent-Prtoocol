import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export const defiParser = StructuredOutputParser.fromZodSchema(
  z.object({
    isSwap: z
      .boolean()
      .describe("Query is related to token swapping or exchange"),
    isTransfer: z
      .boolean()
      .describe("Query is about transferring tokens or assets"),
    isStaking: z.boolean().describe("Query involves staking or yield farming"),
    isTokenLaunch: z
      .boolean()
      .describe("Query is about launching new tokens or cryptocurrencies"),
    isNFTLaunch: z
      .boolean()
      .describe("Query is about creating or launching NFTs"),
    isPumpFun: z
      .boolean()
      .describe("Query is specifically about Pump.Fun platform operations"),
  }),
);

export const defiPrompt = PromptTemplate.fromTemplate(
  `
    You are a DeFi Operations Classifier for a blockchain agent network. Your role is to:
    1. Analyze incoming DeFi-related queries
    2. Determine the SINGLE most relevant DeFi operation being requested
    3. Set ONLY ONE category to true, all others must be false

    Format your response according to:
    {formatInstructions}

    DeFi Operations Categories (Choose ONLY ONE):
    - SWAP: Token swapping, exchange, or trading operations
    - TRANSFER: Moving tokens or assets between addresses
    - STAKING: Staking tokens, yield farming, or liquidity provision
    - TOKEN_LAUNCH: Creating new tokens, memecoins, or cryptocurrencies
    - NFT_LAUNCH: Creating or launching NFT collections
    - PUMP_FUN: Operations specific to Pump.Fun platform

    Detailed Classification Guidelines (Select Most Relevant ONE):
    - Swap queries include: 
      * Token exchanges on DEXes
      * Trading pair inquiries
      * Price impact calculations
      * Slippage settings
      * DEX aggregator usage

    - Transfer queries include:
      * Sending tokens between wallets
      * Cross-chain bridge operations
      * Asset migration
      * Batch transfers
      * Gas fee considerations

    - Staking queries include:
      * Yield farming strategies
      * Liquidity pool participation
      * Staking reward calculations
      * Unstaking procedures
      * Lock-up periods

    - Token Launch queries include:
      * Token creation and deployment
      * Tokenomics design
      * Initial supply settings
      * Token distribution plans
      * Smart contract deployment

    - NFT Launch queries include:
      * Collection creation
      * Metadata setup
      * Minting processes
      * Royalty configurations
      * Marketplace listings

    - Pump.Fun specific queries include:
      * Memecoin creation on Pump.Fun
      * Platform-specific features
      * Pump.Fun token launches
      * Platform fees and requirements
      * Pump.Fun ecosystem interactions

    IMPORTANT: Choose ONLY ONE category. Set that category to true and all others to false.
    If a query could fit multiple categories, choose the most specific and relevant one.
    Priority order for ambiguous cases:
    1. Pump.Fun (if platform-specific)
    2. Token/NFT Launch (if about creation)
    3. Swap/Transfer/Staking (based on main action)

    \n {messages} \n
    `,
);
