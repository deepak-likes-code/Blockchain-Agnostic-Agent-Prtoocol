import { StateGraph } from "@langchain/langgraph";
import { solanaAgentState } from "./utils/state.js";
import { callNode } from "./agent/manager.js";
import { defiNode } from "./agent/defi.js";
import { START, END } from "@langchain/langgraph";
import { toolRouter } from "./router/defi.js";
import { swapMessage } from "./examples/index.js";

const workflow = new StateGraph(solanaAgentState)
  .addNode("manager", callNode)
  .addNode("defi", defiNode)
  .addEdge(START, "manager")
  .addConditionalEdges("manager", toolRouter)
  .addEdge("defi", "manager");

export const graph = workflow.compile();

const result = await graph.invoke(swapMessage);

console.log(result);
