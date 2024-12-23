import { tool } from "@langchain/core/tools";
import { agent } from "../../../utils/agent.js";
import { z } from "zod";
import { lendAsset as luloLendAsset } from "solana-agent-kit/dist/tools/lend.js";
import { PublicKey } from "@solana/web3.js";
import { VersionedTransaction } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";

export interface LuloAccountDetailsResponse {
  totalValue: number;
  interestEarned: number;
  realtimeApy: number;
  settings: {
    owner: string;
    allowedProtocols: string | null;
    homebase: string | null;
    minimumRate: string;
  };
}

// export const lend_tokens = tool(
//   async ({ asset, action, amount }) => {
//     try {
//       // Convert asset string to PublicKey
//       const assetPublicKey = new PublicKey(asset);

//       if (action === "lend") {
//         const result = await lendAsset(
//           agent,
//           assetPublicKey,
//           amount,
//           process.env.LULO_API_KEY,
//         );

//         console.log("Lending transaction:", result);
//         return result;
//       } else {
//         // For borrowing (to be implemented)
//         throw new Error("Borrowing not yet implemented");
//       }
//     } catch (e) {
//       throw new Error(e as string);
//     }
//   },
//   {
//     name: "lend_tokens",
//     description: "Lend or borrow tokens using the Lulo protocol",
//     schema: z.object({
//       asset: z
//         .string()
//         .describe("The mint address of the token to lend or borrow"),
//       action: z
//         .enum(["lend", "borrow"])
//         .describe("Whether to lend or borrow the asset"),
//       amount: z.number().describe("The amount of tokens to lend or borrow"),
//     }),
//   },
// );

// export const get_lending_info = tool(
//   async () => {
//     try {
//       const result = await getLendingDetails(agent, process.env.LULO_API_KEY);

//       console.log("Lending details:", result);
//       return result;
//     } catch (e) {
//       throw new Error(e as string);
//     }
//   },
//   {
//     name: "get_lending_info",
//     description: "Get current lending account details and positions",
//     schema: z.object({}),
//   },
// );

export const stake_sol_jup = tool(
  async ({ amount }) => {
    try {
      const result = await stakeWithJup(agent, amount);

      console.log("Jupiter SOL staking transaction:", result);
      return result;
    } catch (e) {
      throw new Error(e as string);
    }
  },
  {
    name: "stake_sol_jup",
    description: "Stake SOL tokens using Jupiter's liquid staking protocol",
    schema: z.object({
      amount: z
        .number()
        .describe("The amount of SOL tokens to stake (in SOL units)"),
    }),
  },
);

export async function stakeWithJup(
  agent: SolanaAgentKit,
  amount: number,
): Promise<string> {
  try {
    const res = await fetch(
      `https://worker.jup.ag/blinks/swap/So11111111111111111111111111111111111111112/jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v/${amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: agent.wallet.publicKey.toBase58(),
        }),
      },
    );

    const data = await res.json();

    const txn = VersionedTransaction.deserialize(
      Buffer.from(data.transaction, "base64"),
    );

    const { blockhash } = await agent.connection.getLatestBlockhash();
    txn.message.recentBlockhash = blockhash;

    // Sign and send transaction
    txn.sign([agent.wallet]);
    const signature = await agent.connection.sendTransaction(txn, {
      preflightCommitment: "confirmed",
      maxRetries: 3,
    });

    const latestBlockhash = await agent.connection.getLatestBlockhash();
    await agent.connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    return signature;
  } catch (error: any) {
    console.error(error);
    throw new Error(`jupSOL staking failed: ${error.message}`);
  }
}

/**
 * Lend tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param amount Amount of USDC to lend
 * @returns Transaction signature
 */
export async function lendAsset(
  agent: SolanaAgentKit,
  amount: number,
): Promise<string> {
  try {
    const response = await fetch(
      `https://blink.lulo.fi/actions?amount=${amount}&symbol=USDC`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: agent.wallet.publicKey.toBase58(),
        }),
      },
    );

    const data = await response.json();

    // Deserialize the transaction
    const luloTxn = VersionedTransaction.deserialize(
      Buffer.from(data.transaction, "base64"),
    );

    // Get a recent blockhash and set it
    const { blockhash } = await agent.connection.getLatestBlockhash();
    luloTxn.message.recentBlockhash = blockhash;

    // Sign and send transaction
    luloTxn.sign([agent.wallet]);

    const signature = await agent.connection.sendTransaction(luloTxn, {
      preflightCommitment: "confirmed",
      maxRetries: 3,
    });

    // Wait for confirmation using the latest strategy
    const latestBlockhash = await agent.connection.getLatestBlockhash();
    await agent.connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    return signature;
  } catch (error: any) {
    throw new Error(`Lending failed: ${error.message}`);
  }
}

export const lend_usdc_lulo = tool(
  async ({ amount }) => {
    try {
      const result = await lendAsset(agent, amount);
      console.log("USDC lending transaction:", result);
      return result;
    } catch (e) {
      throw new Error(e as string);
    }
  },
  {
    name: "lend_usdc_lulo",
    description:
      "Lend USDC tokens using the Lulo protocol for yield generation",
    schema: z.object({
      amount: z
        .number()
        .describe("The amount of USDC tokens to lend (in USDC units)"),
    }),
  },
);

export const lendingTools = [stake_sol_jup, lend_usdc_lulo];
