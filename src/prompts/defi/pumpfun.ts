import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const pumpfunSchema = z.object({
  token: z.string().describe("The token symbol or address to analyze"),
  strategy: z.string().describe("The trading strategy to employ"),
  timeframe: z.string().describe("The timeframe for the strategy"),
  targetPrice: z.number().describe("The target price for the token"),
});

export const pumpfunParser =
  StructuredOutputParser.fromZodSchema(pumpfunSchema);

export const pumpfunPrompt = PromptTemplate.fromTemplate(`
You are a token trading strategy specialist.
Analyze the user's request and provide structured information for token trading strategies.

User messages: {messages}

${pumpfunParser.getFormatInstructions()}
`);
