import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { tokenList } from "../helpers/tokens.js";
import { gptMiniModel, gptModel } from "../utils/model.js";
import { solanaAgentState } from "../utils/state.js";
import { prompt } from "../prompts/manager.js";
import { defiTools } from "./defi.js";

const modelBoundTool = gptModel.bindTools(defiTools);

const chain = RunnableSequence.from([prompt, modelBoundTool]);

export const defiNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;
  const tokenListStringified = JSON.stringify(tokenList);

  const result = await chain.invoke({
    messages: messages,
    token_list: tokenListStringified,
  });

  return { messages: [result] };
};
