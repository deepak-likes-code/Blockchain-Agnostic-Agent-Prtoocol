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

const workflow = new StateGraph(solanaAgentState)
  .addNode("defiManager", defiNode)
  .addNode("chief", cheifNode)
  .addNode("generalist", generalistNode)
  .addNode("transferSwap", transferSwapNode)
  .addNode("pumpFun", pumpfunNode)
  .addNode("lending", lendingNode)
  .addEdge(START, "chief")
  .addEdge("generalist", END)
  .addConditionalEdges("chief", chiefRouter)
  .addConditionalEdges("defiManager", defiTeamRouter)
  .addEdge("transferSwap", END)
  .addEdge("pumpFun", END)
  .addEdge("lending", END);

export const graph = workflow.compile();

export const transferMessage = {
  messages: [
    new HumanMessage(
      "transfer 1000 bonk to address DZbJiJ2Uiwe3g53KBhJZ4ftdcUJGaVZNyp1ua2saguXC and what is the name the father of Messi? ",
    ),
  ],
};

const result = await graph.invoke(transferMessage);

console.log(result);
