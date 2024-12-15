import { tool } from "@langchain/core/tools";
import { agent } from "../../utils/agent.js";
import { JUP_API } from "solana-agent-kit/dist/constants/index.js";
import { VersionedTransaction } from "@solana/web3.js";
import { z } from "zod";

export const swap_token = tool(
  async ({ outputMint, inputAmount, inputMint, inputDecimal }) => {
    const slippageBps = 300;

    try {
      // Get quote for the swap
      console.log(
        inputMint.toString(),
        outputMint.toString(),
        inputAmount,
        slippageBps,
      );
      const quoteResponse = await (
        await fetch(
          `${JUP_API}/quote?` +
            `inputMint=${inputMint.toString()}` +
            `&outputMint=${outputMint.toString()}` +
            `&amount=${inputAmount * 10 ** inputDecimal}` +
            `&slippageBps=${slippageBps}` +
            `&onlyDirectRoutes=true` +
            `&maxAccounts=20`,
        )
      ).json();

      // Get serialized transaction
      const { swapTransaction } = await (
        await fetch("https://quote-api.jup.ag/v6/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: agent.wallet_address.toString(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: "auto",
          }),
        })
      ).json();
      // Deserialize transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");

      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      // Sign and send transaction
      transaction.sign([agent.wallet]);
      const signature = await agent.connection.sendTransaction(transaction);

      return signature;
    } catch (e) {
      throw new Error(e as string);
    }
  },

  {
    name: "jupiter_swap",
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
