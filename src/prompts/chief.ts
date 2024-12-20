import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

export const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    isTechnicalQuery: z
      .boolean()
      .describe("Query requires technical expertise"),
    isDefiQuery: z
      .boolean()
      .describe("Query is related to DeFi or financial protocols"),
    isGeneralQuestion: z.boolean().describe("Query is about basic concepts"),
    isReadQuery: z
      .boolean()
      .describe(
        "Query requires reading market data, token info, or statistics",
      ),
  }),
);

export const prompt = PromptTemplate.fromTemplate(
  `
    You are the Chief Routing Officer for a multi-blockchain agent network. Your role is to:
    1. Analyze and classify incoming queries
    2. Determine the most appropriate team(s) for handling the query

    Format your response according to:
 {formatInstructions}

    Teams and their specialties:
    - TECHNICAL: Handles technical implementation, coding, and infrastructure questions regarding Solana
    - DEFI: Manages DeFi, trading,lending, staking and financial protocol actions like swapping , trading, creating NFTs , creating shitcoins, memecoins on Pump.Fun, staking/lending on Jupiter, lending/staking on Lulo etc
    - GENERAL: Handles basic blockchain concepts and general information
    - READ: Handles market data queries including top traders, top coins, market statistics, and token information

    Classification Guidelines:
    - Technical queries include: code, smart contracts, implementation details
    - DeFi queries include: trading, liquidity, yields, financial protocols
    - General queries include: basic concepts, terminology, blockchain fundamentals
    - Read queries include: market statistics, token prices, trading volumes, top performers, trending coins, token information, traders

    \n {messages} \n
    `,
);
