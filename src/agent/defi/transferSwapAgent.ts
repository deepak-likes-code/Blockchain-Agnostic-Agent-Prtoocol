import "dotenv/config";
import { tokenList } from "../../helpers/tokens.js";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { transferSwapPrompt } from "../../prompts/defi/transferSwap.js";
import { transferSwapTools } from "./defiToolNode.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export const transferSwapNode = async (
  state: typeof solanaAgentState.State,
) => {
  const { messages } = state;
  const tokenListStringified = JSON.stringify(tokenList);

  const result = await transferSwapGraph.invoke({
    messages: messages,
    token_list: tokenListStringified,
  });

  return { messages: [...result.messages] };
};

const transferSwapGraph = createReactAgent({
  llm: gptModel,
  tools: transferSwapTools,
  stateModifier: transferSwapPrompt,
});
