import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const nftSchema = z.object({
  collection: z.string().describe("The NFT collection name or address"),
  action: z
    .enum(["buy", "sell", "mint"])
    .describe("The action to perform with the NFT"),
  price: z.number().describe("The price in SOL"),
  quantity: z.number().describe("Number of NFTs to buy/sell/mint"),
});

export const nftParser = StructuredOutputParser.fromZodSchema(nftSchema);

export const nftPrompt = PromptTemplate.fromTemplate(`
You are a Solana NFT specialist assistant.
Analyze the user's request and provide structured information for NFT operations.

User messages: {messages}

${nftParser.getFormatInstructions()}
`);
