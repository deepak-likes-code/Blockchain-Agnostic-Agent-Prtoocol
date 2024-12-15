import { StateGraph } from "@langchain/langgraph";
import { solanaAgentState } from "./utils/state.js";
import { defiNode } from "./agent/defiManager.js";
import { defiToolsNode } from "./agent/defi.js";
import { START, END } from "@langchain/langgraph";
import { toolRouter } from "./router/defi.js";
import { swapMessage, generalMessage } from "./examples/index.js";
import { chiefRouter } from "./router/index.js";
import { cheifNode } from "./agent/cheif.js";
import { generalistNode } from "./agent/generalist.js";

const workflow = new StateGraph(solanaAgentState)
  .addNode("defiTeam", defiNode)
  .addNode("chief", cheifNode)
  .addNode("generalist", generalistNode)
  .addNode("defiTools", defiToolsNode)
  .addEdge(START, "chief")
  .addEdge("generalist", END)
  .addConditionalEdges("chief", chiefRouter)
  .addConditionalEdges("defiTeam", toolRouter)
  .addEdge("defiTools", "defiTeam");

export const graph = workflow.compile();

const result = await graph.invoke(generalMessage);

console.log(result);
