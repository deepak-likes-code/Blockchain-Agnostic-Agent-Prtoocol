import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

export const blockchainParser = StructuredOutputParser.fromZodSchema(
  z.object({
    isSolana: z
      .boolean()
      .describe("User explicitly mentioned Solana blockchain"),
    isBase: z.boolean().describe("User explicitly mentioned Base blockchain"),
    isAptos: z.boolean().describe("User explicitly mentioned Aptos blockchain"),
    isFuel: z.boolean().describe("User explicitly mentioned Fuel blockchain"),
  }),
);

export const blockchainPrompt = PromptTemplate.fromTemplate(
  `
    You are a Blockchain Router that determines if a specific blockchain was explicitly mentioned in the query.
    DEFAULT TO SOLANA if no blockchain is explicitly mentioned.

    Format your response according to:
    {formatInstructions}

    Rules:
    - Only mark a blockchain as true if it is EXPLICITLY mentioned
    - If no blockchain is mentioned, all values should be false (system will default to Solana)
    - Look for explicit mentions like:
      * "Solana", "SOL"
      * "Base","base", "base testnet"
      * "Aptos", "APT"
      * "Fuel"
    - Do not infer blockchain from protocols or tokens unless explicitly stated

    Example:
    "transfer 100 usdc to 0x123 on base" -> isBase: true (others false)
    "swap 0.6 usdt to usdc on solana" -> all false (defaults to Solana)

    \n {messages} \n
    `,
);