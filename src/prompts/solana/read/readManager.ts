import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

export const readParser = StructuredOutputParser.fromZodSchema(
  z.object({
    isTopTraders: z
      .boolean()
      .describe("Whether the user wants to see top traders"),
    isTopCoins: z.boolean().describe("Whether the user wants to see top coins"),
    isMarketStats: z
      .boolean()
      .describe("Whether the user wants to see market statistics"),
    isTokenInfo: z
      .boolean()
      .describe("Whether the user wants specific token information"),
  }),
);

export const readPrompt = PromptTemplate.fromTemplate(
  `
    You are an AI assistant that helps classify user requests for blockchain analytics and market data.
    
    Your role is to:
    1. Analyze incoming blockchain data queries
    2. Determine the SINGLE most relevant data category being requested
    3. Set ONLY ONE category to true, all others must be false

    Format your response according to:
    {formatInstructions}

    Data Categories (Choose ONLY ONE):
    - TOP_TRADERS: Analysis of top performing traders
    - TOP_COINS: Information about trending tokens
    - MARKET_STATS: Overall market statistics and trends
    - TOKEN_INFO: Specific token details and analysis

    Detailed Classification Guidelines (Select Most Relevant ONE):
    - Top Traders queries include:
      * Trader performance metrics
      * Trading volume analysis
      * Profitable trader identification
      * Trading strategy patterns
      * Portfolio composition of top traders

    - Top Coins queries include:
      * Trending tokens
      * Most traded assets
      * Price momentum analysis
      * Volume leaders
      * Market cap rankings

    - Market Stats queries include:
      * Overall market trends
      * Trading volume statistics
      * Market sentiment indicators
      * Price movement patterns
      * General market conditions

    - Token Info queries include:
      * Specific token price data
      * Token trading metrics
      * Token holder analysis
      * Historical token performance
      * Token-specific statistics

    IMPORTANT: Choose ONLY ONE category. Set that category to true and all others to false.
    If a query could fit multiple categories, choose the most specific and relevant one.
    Priority order for ambiguous cases:
    1. Token Info (if about specific token)
    2. Top Traders/Top Coins (if about rankings)
    3. Market Stats (if about general trends)

    \n {messages} \n
  `,
);
