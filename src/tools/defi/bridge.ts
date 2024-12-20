import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { agent } from "../../utils/agent.js";
import { Wormhole, wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import {
  ChainAddress,
  Network,
  Signer,
  Chain,
  ChainContext,
} from "@wormhole-foundation/sdk";
import { CircleTransfer } from "@wormhole-foundation/sdk";

// Helper to get environment variables
function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
}

// Signer setup for different chains
async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>,
): Promise<{
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}> {
  let signer: Signer;
  const platform = chain.platform.utils()._platform;

  switch (platform) {
    case "Solana":
      signer = await (
        await solana()
      ).getSigner(await chain.getRpc(), getEnv("SOLANA_PRIVATE_KEY"));
      break;
    case "Evm":
      signer = await (
        await evm()
      ).getSigner(await chain.getRpc(), getEnv("ETH_PRIVATE_KEY"));
      break;
    default:
      throw new Error("Unsupported platform: " + platform);
  }

  return {
    chain,
    signer: signer as Signer<N, C>,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}

// Bridge USDC using automatic transfer
export const bridge_usdc_auto = tool(
  async ({ amount, toAddress }) => {
    try {
      // Initialize Wormhole SDK
      const wh = await wormhole("Mainnet", [evm, solana]);

      // Setup source (Solana) and destination (Base) chains
      const sendChain = wh.getChain("Solana");
      const rcvChain = wh.getChain("Base");

      console.log(sendChain, rcvChain);

      // Get signers for both chains
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Convert amount to proper units (USDC has 6 decimals)
      const transferAmount = BigInt(amount * 1_000_000);

      // Create automatic transfer
      const transfer = await wh.circleTransfer(
        transferAmount,
        source.address,
        destination.address,
        true, // automatic = true
      );

      // Initiate the transfer
      const srcTxids = await transfer.initiateTransfer(source.signer);

      return {
        status: "success",
        message: "Bridge transfer initiated successfully",
        sourceTransactionIds: srcTxids,
        transferDetails: {
          amount: amount,
          fromChain: "Solana",
          toChain: "Base",
          destinationAddress: toAddress,
        },
      };
    } catch (e) {
      throw new Error(`Bridge transfer failed: ${e}`);
    }
  },
  {
    name: "bridge_usdc_auto",
    description:
      "Bridge USDC from Solana to Base using Wormhole's automatic transfer",
    schema: z.object({
      amount: z.number().describe("Amount of USDC to bridge"),
      toAddress: z.string().describe("Destination address on Base network"),
    }),
  },
);

// Bridge USDC using manual transfer
export const bridge_usdc_manual = tool(
  async ({ amount, toAddress }) => {
    try {
      // Initialize Wormhole SDK
      const wh = await wormhole("Mainnet", [evm, solana]);

      // Setup source and destination chains
      const sendChain = wh.getChain("Solana");
      const rcvChain = wh.getChain("Base");

      // Get signers
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Convert amount
      const transferAmount = BigInt(amount * 1_000_000);

      // Create manual transfer
      const transfer = await wh.circleTransfer(
        transferAmount,
        source.address,
        destination.address,
        false, // automatic = false
      );

      // Step 1: Initiate transfer
      const srcTxids = await transfer.initiateTransfer(source.signer);

      // Step 2: Fetch attestation with timeout
      const timeout = 60 * 1000; // 60 seconds
      const attestIds = await transfer.fetchAttestation(timeout);

      // Step 3: Complete transfer on destination chain
      const dstTxids = await transfer.completeTransfer(destination.signer);

      return {
        status: "success",
        message: "Manual bridge transfer completed successfully",
        sourceTransactionIds: srcTxids,
        attestationIds: attestIds,
        destinationTransactionIds: dstTxids,
        transferDetails: {
          amount: amount,
          fromChain: "Solana",
          toChain: "Base",
          destinationAddress: toAddress,
        },
      };
    } catch (e) {
      throw new Error(`Manual bridge transfer failed: ${e}`);
    }
  },
  {
    name: "bridge_usdc_manual",
    description:
      "Bridge USDC from Solana to Base using Wormhole's manual transfer process",
    schema: z.object({
      amount: z.number().describe("Amount of USDC to bridge"),
      toAddress: z.string().describe("Destination address on Base network"),
    }),
  },
);

// Function to complete partial transfers
export const complete_partial_transfer = tool(
  async ({ sourceTxHash, toAddress }) => {
    try {
      const wh = await wormhole("Mainnet", [evm, solana]);
      const rcvChain = wh.getChain("Base");
      const destination = await getSigner(rcvChain);

      const timeout = 60 * 1000;

      // Reconstruct transfer from source transaction
      const transfer = await CircleTransfer.from(
        wh,
        {
          chain: "Solana",
          txid: sourceTxHash,
        },
        timeout,
      );

      // Complete the transfer
      const dstTxids = await transfer.completeTransfer(destination.signer);

      return {
        status: "success",
        message: "Partial transfer completed successfully",
        destinationTransactionIds: dstTxids,
        transferDetails: {
          toChain: "Base",
          destinationAddress: toAddress,
        },
      };
    } catch (e) {
      throw new Error(`Completing partial transfer failed: ${e}`);
    }
  },
  {
    name: "complete_partial_transfer",
    description:
      "Complete a partially executed bridge transfer using the source transaction hash",
    schema: z.object({
      sourceTxHash: z
        .string()
        .describe(
          "Transaction hash from the source chain where the transfer was initiated",
        ),
      toAddress: z.string().describe("Destination address on Base network"),
    }),
  },
);
