import { SolanaAgentKit } from "solana-agent-kit";

export const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.SOLANA_MAINNET_RPC!,
  process.env.OPENAI_API_KEY!,
);
