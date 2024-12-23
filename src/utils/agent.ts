import { SolanaAgentKit } from "solana-agent-kit";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";

export const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.SOLANA_MAINNET_RPC!,
  process.env.OPENAI_API_KEY!,
);

export const testAgent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.SOLANA_DEVNET_RPC!,
  process.env.OPENAI_API_KEY!,
);
