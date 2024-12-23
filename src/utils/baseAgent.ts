import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { GetWalletDetailsAction } from "@coinbase/cdp-agentkit-core";
import fs from "fs";


const WALLET_DATA_FILE = "wallet_data.txt";


  let walletDataStr: string | null = null;

  // Read existing wallet data if available
  if (fs.existsSync(WALLET_DATA_FILE)) {
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
      // Continue without wallet data
    }
  }


    const config = {
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };


// Add error handling around wallet configuration

    const agentkit = await CdpAgentkit.configureWithWallet(config);

    const exportWallet = await agentkit.exportWallet()
    console.log(exportWallet)
    fs.writeFileSync(WALLET_DATA_FILE, exportWallet);


  // Initialize CDP AgentKit Toolkit and get tools
  const cdpToolkit = new CdpToolkit(agentkit);
 export const tools = cdpToolkit.getTools();





