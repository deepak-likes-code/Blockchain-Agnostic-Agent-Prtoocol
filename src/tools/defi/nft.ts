import { tool } from "@langchain/core/tools";
import { agent } from "../../utils/agent.js";
import { JUP_API } from "solana-agent-kit/dist/constants/index.js";
import { VersionedTransaction } from "@solana/web3.js";
import { z } from "zod";

export const mintShitCoin = tool(
  async () => {},

  {
    name: "mint_shit_coin",
    description:
      "call to swap/trade tokens from one token to the other using Jupiter exchange",
    schema: z.object({
      outputMint: z
        .string()
        .describe("The mint address of destination token to be swapped to"),
      inputAmount: z
        .number()
        .describe(
          "the input amount of the token to be swapped without adding any decimals",
        ),
      inputMint: z.string().describe("The mint address of the origin token "),
      inputDecimal: z
        .number()
        .describe("The decimal of the input token that is being traded"),
    }),
  },
);
