import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { tokenList } from "../../../helpers/tokens.js";
import { gptModel } from "../../../utils/model.js";
import { solanaAgentState } from "../../../utils/state.js";
import { lendingPrompt } from "../../../prompts/solana/defi/lending.js";
import { lendingTools } from "../../../tools/solana/defi/lendTokens.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const lendingGraph = createReactAgent({
  llm: gptModel,
  tools: lendingTools,
  stateModifier: lendingPrompt,
});

export const lendingNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;
  const tokenListStringified = JSON.stringify(tokenList);

  const result = await lendingGraph.invoke({
    messages: messages,
    token_list: tokenListStringified,
  });

  return { messages: [...result.messages] };
};
