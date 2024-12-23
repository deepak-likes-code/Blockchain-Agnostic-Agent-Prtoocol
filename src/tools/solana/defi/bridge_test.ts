import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { agent } from "../../../utils/agent.js";
import { Wormhole, wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { providers } from "ethers";
import {
  ChainAddress,
  Network,
  Signer,
  Chain,
  ChainContext,
} from "@wormhole-foundation/sdk";
import { CircleTransfer } from "@wormhole-foundation/sdk";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

// Testnet USDC addresses
const USDC_ADDRESS = {
  SOLANA: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
  BASE: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // BaseSepolia USDC
  POLYGON: "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97", // Mumbai (Polygon Testnet) USDC
  SEPOLIA: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
};

// Helper to get environment variables
function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
}

// Check USDC balance
async function checkUSDCBalance(
  walletAddress: PublicKey,
  requiredAmount: number,
): Promise<void> {
  console.log(`Checking USDC balance for wallet: ${walletAddress.toString()}`);
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      USDC_ADDRESS.SOLANA,
      walletAddress,
    );
    console.log(`Associated token account address: ${tokenAccount.toString()}`);

    try {
      const accountInfo = await getAccount(agent.connection, tokenAccount);
      const balance = Number(accountInfo.amount) / 1_000_000; // USDC has 6 decimals

      console.log(`Current USDC Balance: ${balance} USDC`);
      console.log(`Required Amount: ${requiredAmount} USDC`);

      if (balance < requiredAmount) {
        throw new Error(
          `Insufficient USDC balance. Have: ${balance} USDC, Need: ${requiredAmount} USDC`,
        );
      }
    } catch (error) {
      console.error("Token account error details:", error);
      throw new Error("No USDC token account found or couldn't fetch balance");
    }
  } catch (error: any) {
    console.error("USDC balance check error details:", error);
    throw new Error(`USDC balance check failed: ${error.message}`);
  }
}

// Ensure token account exists
async function ensureTokenAccount(walletAddress: PublicKey): Promise<void> {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(
      USDC_ADDRESS.SOLANA,
      walletAddress,
    );

    try {
      await getAccount(agent.connection, associatedTokenAddress);
      console.log("USDC token account exists");
    } catch (error) {
      console.log("Creating USDC token account...");
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          walletAddress,
          associatedTokenAddress,
          walletAddress,
          USDC_ADDRESS.SOLANA,
        ),
      );

      const signature = await agent.connection.sendTransaction(transaction, [
        agent.wallet,
      ]);
      await agent.connection.confirmTransaction(signature);
      console.log("USDC token account created:", signature);
    }
  } catch (error: any) {
    throw new Error(`Failed to setup USDC token account: ${error.message}`);
  }
}

// Signer setup for different chains
async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>,
): Promise<{
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}> {
  console.log(`Setting up signer for chain: ${chain.chain}`);
  let signer: Signer;
  const platform = chain.platform.utils()._platform;
  console.log(`Platform identified as: ${platform}`);

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

  const address = Wormhole.chainAddress(chain.chain, signer.address());
  console.log(`Signer address for ${chain.chain}: ${address.toString()}`);
  return { chain, signer: signer as Signer<N, C>, address };
}

// Bridge USDC using automatic transfer
export const bridge_usdc_auto = tool(
  async ({ amount, toAddress }) => {
    console.log(
      `Starting automatic bridge transfer of ${amount} USDC to ${toAddress}`,
    );
    try {
      // Initialize Wormhole SDK with Testnet
      const wh = await wormhole("Testnet", [evm, solana]);

      // Setup chains
      const sendChain = wh.getChain("Solana");
      const rcvChain = wh.getChain("BaseSepolia");

      console.log("Initializing automatic transfer between chains:", {
        source: sendChain.chain,
        destination: rcvChain.chain,
      });

      // Get signers
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Check USDC setup and balance
      const solanaWallet = new PublicKey(source.signer.address());

      console.log("Checking USDC setup...");
      // await ensureTokenAccount(solanaWallet);

      console.log("Verifying USDC balance...");
      // await checkUSDCBalance(solanaWallet, amount);

      // Convert amount for transfer
      const transferAmount = BigInt(amount * 1_000_000);

      // Set native gas amount for automatic transfer
      const nativeGas = BigInt(0); // or use amount.units(amount.parse('0.0', 6))

      console.log("Creating automatic circle transfer...");
      const transfer = await wh.circleTransfer(
        transferAmount,
        source.address,
        destination.address,
        true, // automatic = true
        undefined, // default options
        nativeGas, // add native gas parameter
      );

      console.log("Initiating automatic transfer...");
      const srcTxids = await transfer.initiateTransfer(source.signer);
      console.log("Transfer initiated:", srcTxids);

      console.log("Transfer configuration:", {
        amount: amount,
        transferAmount: transferAmount.toString(),
        sourceChain: sendChain.chain,
        destinationChain: rcvChain.chain,
        sourceAddress: source.address.toString(),
        destinationAddress: destination.address.toString(),
      });

      return {
        status: "success",
        message: "Automatic testnet bridge transfer initiated successfully",
        sourceTransactionIds: srcTxids,
        transferDetails: {
          amount: amount,
          fromChain: "Solana",
          toChain: "BaseSepolia",
          destinationAddress: toAddress,
          testnetInfo: {
            solanaUSDC: USDC_ADDRESS.SOLANA.toString(),
            baseUSDC: USDC_ADDRESS.BASE,
          },
        },
      };
    } catch (e: any) {
      console.error("Bridge transfer error:", {
        error: e,
        stack: e.stack,
        amount,
        toAddress,
      });
      throw new Error(`Automatic testnet bridge transfer failed: ${e.message}`);
    }
  },
  {
    name: "bridge_usdc_auto",
    description:
      "Bridge USDC from Solana to Base Sepolia using Wormhole's automatic transfer",
    schema: z.object({
      amount: z.number().describe("Amount of USDC to bridge"),
      toAddress: z.string().describe("Destination address on Base Sepolia"),
    }),
  },
);

// Bridge USDC using manual transfer
export const bridge_usdc_manual = tool(
  async ({ amount, toAddress }) => {
    try {
      // Initialize Wormhole SDK with Testnet
      const wh = await wormhole("Testnet", [evm, solana]);

      // Setup chains
      const sendChain = wh.getChain("Solana");
      const rcvChain = wh.getChain("BaseSepolia");

      console.log("Initializing manual transfer between chains:", {
        source: sendChain.chain,
        destination: rcvChain.chain,
      });

      // Get signers
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Check USDC setup and balance
      const solanaWallet = new PublicKey(source.signer.address());

      console.log("Checking USDC setup...");
      // await ensureTokenAccount(solanaWallet);

      console.log("Verifying USDC balance...");
      // await checkUSDCBalance(solanaWallet, amount);

      // Convert amount for transfer
      const transferAmount = BigInt(amount * 1_000_000);

      console.log("Creating circle transfer...");
      const transfer = await wh.circleTransfer(
        transferAmount,
        source.address,
        destination.address,
        false, // automatic = false
      );

      console.log("Initiating transfer...");
      const srcTxids = await transfer.initiateTransfer(source.signer);
      console.log("Transfer initiated:", srcTxids);

      console.log("Fetching attestation...");
      const timeout = 120 * 1000; // 2 minutes timeout
      const attestIds = await transfer.fetchAttestation(timeout);
      console.log("Attestation received:", attestIds);

      console.log("Completing transfer on destination chain...");
      const dstTxids = await transfer.completeTransfer(destination.signer);
      console.log("Transfer completed:", dstTxids);

      return {
        status: "success",
        message: "Manual testnet bridge transfer completed successfully",
        sourceTransactionIds: srcTxids,
        attestationIds: attestIds,
        destinationTransactionIds: dstTxids,
        transferDetails: {
          amount: amount,
          fromChain: "Solana",
          toChain: "BaseSepolia",
          destinationAddress: toAddress,
          testnetInfo: {
            solanaUSDC: USDC_ADDRESS.SOLANA.toString(),
            baseUSDC: USDC_ADDRESS.BASE,
          },
        },
      };
    } catch (e: any) {
      console.error("Detailed error:", e);
      throw new Error(`Manual testnet bridge transfer failed: ${e.message}`);
    }
  },
  {
    name: "bridge_usdc_manual",
    description:
      "Bridge USDC from Solana to Base Sepolia using Wormhole's manual transfer process",
    schema: z.object({
      amount: z.number().describe("Amount of USDC to bridge"),
      toAddress: z.string().describe("Destination address on Base Sepolia"),
    }),
  },
);

// Complete partial transfers
export const complete_partial_transfer = tool(
  async ({ sourceTxHash, toAddress }) => {
    try {
      const wh = await wormhole("Testnet", [evm, solana]);
      const rcvChain = wh.getChain("BaseSepolia");
      const destination = await getSigner(rcvChain);

      console.log("Recovering partial transfer...");
      const timeout = 120 * 1000;

      // Reconstruct transfer from source transaction
      const transfer = await CircleTransfer.from(
        wh,
        {
          chain: "Solana",
          txid: sourceTxHash,
        },
        timeout,
      );

      console.log("Completing partial transfer...");
      const dstTxids = await transfer.completeTransfer(destination.signer);
      console.log("Transfer completed:", dstTxids);

      return {
        status: "success",
        message: "Partial testnet transfer completed successfully",
        destinationTransactionIds: dstTxids,
        transferDetails: {
          toChain: "BaseSepolia",
          destinationAddress: toAddress,
          testnetInfo: {
            solanaUSDC: USDC_ADDRESS.SOLANA.toString(),
            baseUSDC: USDC_ADDRESS.BASE,
          },
        },
      };
    } catch (e: any) {
      console.error("Detailed error:", e);
      throw new Error(
        `Completing partial testnet transfer failed: ${e.message}`,
      );
    }
  },
  {
    name: "complete_partial_transfer",
    description:
      "Complete a partially executed bridge transfer on testnet using the source transaction hash",
    schema: z.object({
      sourceTxHash: z
        .string()
        .describe(
          "Transaction hash from the source chain where the transfer was initiated",
        ),
      toAddress: z.string().describe("Destination address on Base Sepolia"),
    }),
  },
);

export const bridge_usdc_base_to_polygon = tool(
  async ({ amount, toAddress }) => {
    console.log(
      `Starting automatic bridge transfer of ${amount} USDC from Base to Polygon (Mumbai) to ${toAddress}`,
    );
    try {
      // Initialize Wormhole SDK with Testnet
      const wh = await wormhole("Testnet", [evm]);

      // Setup chains
      const sendChain = wh.getChain("BaseSepolia");
      const rcvChain = wh.getChain("Polygon");

      console.log("Initializing automatic transfer between chains:", {
        source: sendChain.chain,
        destination: rcvChain.chain,
      });

      // Get signers
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Convert amount for transfer (USDC has 6 decimals)
      const transferAmount = BigInt(amount * 1_000_000);

      // Set native gas amount for automatic transfer
      const nativeGas = BigInt(0);

      console.log("Creating automatic circle transfer...");
      const transfer = await wh.circleTransfer(
        transferAmount,
        source.address,
        destination.address,
        true, // automatic = true
        undefined, // default options
        nativeGas,
      );

      console.log("Initiating automatic transfer...");
      const srcTxids = await transfer.initiateTransfer(source.signer);
      console.log("Transfer initiated:", srcTxids);

      console.log("Transfer configuration:", {
        amount: amount,
        transferAmount: transferAmount.toString(),
        sourceChain: sendChain.chain,
        destinationChain: rcvChain.chain,
        sourceAddress: source.address.toString(),
        destinationAddress: destination.address.toString(),
      });

      return {
        status: "success",
        message: "Automatic testnet bridge transfer initiated successfully",
        sourceTransactionIds: srcTxids,
        transferDetails: {
          amount: amount,
          fromChain: "BaseSepolia",
          toChain: "Mumbai",
          destinationAddress: toAddress,
          testnetInfo: {
            baseUSDC: USDC_ADDRESS.BASE,
            polygonUSDC: USDC_ADDRESS.POLYGON,
          },
        },
      };
    } catch (e: any) {
      console.error("Bridge transfer error:", {
        error: e,
        stack: e.stack,
        amount,
        toAddress,
      });
      throw new Error(`Automatic testnet bridge transfer failed: ${e.message}`);
    }
  },
  {
    name: "bridge_usdc_base_to_polygon",
    description:
      "Bridge USDC from Base Sepolia to Polygon Mumbai using Wormhole's automatic transfer",
    schema: z.object({
      amount: z.number().describe("Amount of USDC to bridge"),
      toAddress: z.string().describe("Destination address on Polygon Mumbai"),
    }),
  },
);

export const bridge_usdc_base_to_sepolia = tool(
  async ({ amount, toAddress }) => {
    console.log(
      `Starting manual bridge transfer of ${amount} USDC from Base to Sepolia to ${toAddress}`,
    );
    try {
      // Initialize Wormhole SDK with Testnet
      const wh = await wormhole("Testnet", [evm]);

      // Setup chains
      const sendChain = wh.getChain("BaseSepolia");
      const rcvChain = wh.getChain("Sepolia");

      console.log("Initializing manual transfer between chains:", {
        source: sendChain.chain,
        destination: rcvChain.chain,
      });

      // Get signers
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Convert amount for transfer (USDC has 6 decimals)
      const transferAmount = BigInt(amount * 1_000_000);

      console.log("Creating circle transfer...");
      const transfer = await wh.circleTransfer(
        transferAmount,
        source.address,
        destination.address,
        false, // automatic = false for manual transfer
      );

      console.log("Initiating transfer...");
      const srcTxids = await transfer.initiateTransfer(source.signer);
      console.log("Transfer initiated:", srcTxids);

      console.log("Fetching attestation...");
      const timeout = 120 * 1000; // 2 minutes timeout
      const attestIds = await transfer.fetchAttestation(timeout);
      console.log("Attestation received:", attestIds);

      console.log("Completing transfer on destination chain...");
      const dstTxids = await transfer.completeTransfer(destination.signer);
      console.log("Transfer completed:", dstTxids);

      return {
        status: "success",
        message: "Manual testnet bridge transfer completed successfully",
        sourceTransactionIds: srcTxids,
        attestationIds: attestIds,
        destinationTransactionIds: dstTxids,
        transferDetails: {
          amount: amount,
          fromChain: "BaseSepolia",
          toChain: "Sepolia",
          destinationAddress: toAddress,
          testnetInfo: {
            baseUSDC: USDC_ADDRESS.BASE,
            sepoliaUSDC: USDC_ADDRESS.SEPOLIA,
          },
        },
      };
    } catch (e: any) {
      console.error("Bridge transfer error:", {
        error: e,
        stack: e.stack,
        amount,
        toAddress,
      });
      throw new Error(`Manual testnet bridge transfer failed: ${e.message}`);
    }
  },
  {
    name: "bridge_usdc_base_to_sepolia_manual",
    description:
      "Bridge USDC from Base Sepolia to Sepolia using Wormhole's manual transfer process",
    schema: z.object({
      amount: z.number().describe("Amount of USDC to bridge"),
      toAddress: z.string().describe("Destination address on Sepolia"),
    }),
  },
);
