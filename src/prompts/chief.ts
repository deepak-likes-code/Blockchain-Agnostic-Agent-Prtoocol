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
    - DEFI: Manages DeFi, trading, and financial protocol actions like swapping , trading, creating NFTs , creating shitcoins, memecoins on Pump.Fun etc
    - CURRENT_AFFAIRS: Addresses recent blockchain events, news, and updates
    - GENERAL: Handles basic blockchain concepts and general information

    Classification Guidelines:
    - Technical queries include: code, smart contracts, implementation details
    - DeFi queries include: trading, liquidity, yields, financial protocols
    - Current affairs include: recent updates, news, network changes
    - General queries include: basic concepts, terminology, blockchain fundamentals

    \n {messages} \n
    `,
);
