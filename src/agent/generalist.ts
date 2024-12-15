import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { solanaAgentState } from "../utils/state.js";
import { gptMiniModel } from "../utils/model.js";
import { webSearchTool } from "../tools/search.js";

const reactGraph = createReactAgent({
  llm: gptMiniModel,
  tools: [webSearchTool],
});

export const generalistNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await reactGraph.invoke({ messages });

  return { messages: [...result.messages] };
};

// const result = await reactGraph.invoke({
//   messages: "what is the meaning of life",
// });

// console.log(result.messages);
