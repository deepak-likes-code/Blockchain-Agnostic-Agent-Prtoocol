import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

export const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    isBlockchainQuery: z
      .boolean()
      .describe("Query is related to blockchain, crypto, or DeFi"),
    isGeneralQuestion: z
      .boolean()
      .describe("Query is about non-blockchain topics"),
  }),
);

export const prompt = PromptTemplate.fromTemplate(
  `
    You are the Chief Routing Officer for a multi-blockchain agent network. Your role is to:
    1. Analyze and classify incoming queries
    2. Determine if the query is blockchain-related or general

    Format your response according to:
    {formatInstructions}

    Classification Guidelines:
    - Blockchain queries include: 
      * Any activity on Base, Solana, or Fuel networks
      * DeFi, trading, NFTs, cryptocurrencies, smart contracts
      * Token information, market data
      * Network-specific actions (Base name registrations, Solana programs, Fuel scripts)
    - General queries include: non-blockchain topics, internet searches, general knowledge

    \n {messages} \n
    `,
);
