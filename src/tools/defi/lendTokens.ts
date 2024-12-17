import { tool } from "@langchain/core/tools";
import { agent } from "../../utils/agent.js";
import { z } from "zod";
import {
  lendAsset,
  getLendingDetails,
} from "solana-agent-kit/dist/tools/lend.js";
import { PublicKey } from "@solana/web3.js";

export const lend_tokens = tool(
  async ({ asset, action, amount }) => {
    try {
      // Convert asset string to PublicKey
      const assetPublicKey = new PublicKey(asset);

      if (action === "lend") {
        const result = await lendAsset(
          agent,
          assetPublicKey,
          amount,
          process.env.LULO_API_KEY,
        );

        console.log("Lending transaction:", result);
        return result;
      } else {
        // For borrowing (to be implemented)
        throw new Error("Borrowing not yet implemented");
      }
    } catch (e) {
      throw new Error(e as string);
    }
  },
  {
    name: "lend_tokens",
    description: "Lend or borrow tokens using the Lulo protocol",
    schema: z.object({
      asset: z
        .string()
        .describe("The mint address of the token to lend or borrow"),
      action: z
        .enum(["lend", "borrow"])
        .describe("Whether to lend or borrow the asset"),
      amount: z.number().describe("The amount of tokens to lend or borrow"),
    }),
  },
);

export const get_lending_info = tool(
  async () => {
    try {
      const result = await getLendingDetails(agent, process.env.LULO_API_KEY);

      console.log("Lending details:", result);
      return result;
    } catch (e) {
      throw new Error(e as string);
    }
  },
  {
    name: "get_lending_info",
    description: "Get current lending account details and positions",
    schema: z.object({}),
  },
);

export const lendingTools = [lend_tokens, get_lending_info];
