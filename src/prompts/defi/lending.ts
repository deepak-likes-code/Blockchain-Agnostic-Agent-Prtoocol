import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const lendingSchema = z.object({
  asset: z.string().describe("The asset to lend or borrow"),
  action: z.enum(["lend", "borrow"]).describe("Whether to lend or borrow"),
  amount: z.number().describe("The amount to lend or borrow"),
  term: z.string().describe("The lending/borrowing term"),
  apy: z.number().describe("The expected APY"),
});

export const lendingParser =
  StructuredOutputParser.fromZodSchema(lendingSchema);

export const lendingPrompt = PromptTemplate.fromTemplate(`
You are a DeFi lending specialist.
Analyze the user's request and provide structured information for lending operations.

Available tokens: {token_list}

User messages: {messages}

${lendingParser.getFormatInstructions()}
`);
