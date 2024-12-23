import { StateGraph } from "@langchain/langgraph";
import { solanaAgentState } from "./utils/state.js";
import { defiNode } from "./agent/defi/defiManager.js";
import { transferSwapNode } from "./agent/defi/transferSwapAgent.js";
import { START, END } from "@langchain/langgraph";
import { blockchainChiefRouter, chiefRouter } from "./router/index.js";
import { cheifNode } from "./agent/cheif.js";
import { generalistNode } from "./agent/generalist.js";
import { HumanMessage } from "@langchain/core/messages";
import { baseRouter, defiTeamRouter } from "./router/defi.js";
import { pumpfunNode } from "./agent/defi/pumpfunAgent.js";
import { lendingNode } from "./agent/defi/lendingAgent.js";
import { bridgeNode } from "./agent/defi/bridgeAgent.js";
import { readNode } from "./agent/read/readManager.js";
import { readAnalyticsNode } from "./agent/read/readAgent.js";
import { baseNode } from "./agent/base/baseManager.js";
import { basenameNode } from "./agent/base/basenameAgent.js";
import { nftNode as baseNftNode } from "./agent/base/nftAgent.js";
import { tradeTransferNode as baseTradeTransferNode } from "./agent/base/tradeTransferAgent.js";
import { zoraNode as baseZoraNode } from "./agent/base/zoraAgent.js";
import { blockchainChiefNode } from "./agent/blockchainChief.js";


const workflow = new StateGraph(solanaAgentState)
.addNode("chief", cheifNode)
.addNode("defiManager", defiNode)
  .addNode("generalist", generalistNode)
  .addNode("transferSwap", transferSwapNode)
  .addNode("pumpFun", pumpfunNode)
  .addNode("lending", lendingNode)
  .addNode("bridge", bridgeNode)
  .addNode("readManager", readNode)
  .addNode("readAnalytics", readAnalyticsNode)
  .addNode("base", baseNode)
  .addNode("basename", basenameNode)
  .addNode("baseNft", baseNftNode)
  .addNode("baseTradeTransfer", baseTradeTransferNode)
  .addNode("baseZora", baseZoraNode)
  .addNode("blockchainChief", blockchainChiefNode)
  .addEdge(START, "chief")
  .addEdge("generalist", END)
  .addConditionalEdges("chief", chiefRouter)
  .addConditionalEdges("blockchainChief", blockchainChiefRouter)
  .addConditionalEdges("defiManager", defiTeamRouter)
  .addConditionalEdges("base", baseRouter)
  .addEdge("bridge", END)
  .addEdge("transferSwap", END)
  .addEdge("pumpFun", END)
  .addEdge("lending", END)
  .addEdge("readManager", "readAnalytics")
  .addEdge("readAnalytics", END)
  .addEdge("basename", END)
  .addEdge("baseNft", END)
  .addEdge("baseTradeTransfer", END)
  .addEdge("baseZora", END);

export const graph = workflow.compile();

export const transferMessage = {
  messages: [
    new HumanMessage("register a domain name for 'test4324' on base testnet"),
  ],
};

const result = await graph.invoke(transferMessage);

console.log(result);
