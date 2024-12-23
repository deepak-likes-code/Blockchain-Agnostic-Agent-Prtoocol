import { SolanaAgentKit } from "solana-agent-kit";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain"

export const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.SOLANA_MAINNET_RPC!,
  process.env.OPENAI_API_KEY!,
);


const config = {
     cdpWalletData:undefined,
    
    
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };




 export const baseAgent = await CdpAgentkit.configureWithWallet(config);