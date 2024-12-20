import { StateGraph } from "@langchain/langgraph";
import { solanaAgentState } from "./utils/state.js";
import { defiNode } from "./agent/defi/defiManager.js";
import { transferSwapNode } from "./agent/defi/transferSwapAgent.js";
import { START, END } from "@langchain/langgraph";
import { chiefRouter } from "./router/index.js";
import { cheifNode } from "./agent/cheif.js";
import { generalistNode } from "./agent/generalist.js";
import { HumanMessage } from "@langchain/core/messages";
import { defiTeamRouter } from "./router/defi.js";
import { pumpfunNode } from "./agent/defi/pumpfunAgent.js";
import { lendingNode } from "./agent/defi/lendingAgent.js";
import { bridgeNode } from "./agent/defi/bridgeAgent.js";
import { readNode } from "./agent/read/readManager.js";
import { readAnalyticsNode } from "./agent/read/readAgent.js";
const workflow = new StateGraph(solanaAgentState)
  .addNode("defiManager", defiNode)
  .addNode("chief", cheifNode)
  .addNode("generalist", generalistNode)
  .addNode("transferSwap", transferSwapNode)
  .addNode("pumpFun", pumpfunNode)
  .addNode("lending", lendingNode)
  .addNode("bridge", bridgeNode)
  .addNode("readManager", readNode)
  .addNode("readAnalytics", readAnalyticsNode)
  .addEdge(START, "chief")
  .addEdge("generalist", END)
  .addConditionalEdges("chief", chiefRouter)
  .addConditionalEdges("defiManager", defiTeamRouter)
  .addEdge("bridge", END)
  .addEdge("transferSwap", END)
  .addEdge("pumpFun", END)
  .addEdge("lending", END)
  .addEdge("readManager", "readAnalytics")
  .addEdge("readAnalytics", END);

export const graph = workflow.compile();

export const transferMessage = {
  messages: [
    new HumanMessage("what are the tredning coins on solana right now?"),
  ],
};

const result = await graph.invoke(transferMessage);

console.log(result);
