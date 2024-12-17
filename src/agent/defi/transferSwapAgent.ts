import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { tokenList } from "../../helpers/tokens.js";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { transferSwapPrompt } from "../../prompts/defi/transferSwap.js";
import { transferSwapTools } from "./tools/defi.js";

const modelBoundTool = gptModel.bindTools(transferSwapTools);

const chain = RunnableSequence.from([transferSwapPrompt, modelBoundTool]);

export const transferSwapNode = async (
  state: typeof solanaAgentState.State,
) => {
  const { messages } = state;
  const tokenListStringified = JSON.stringify(tokenList);

  const result = await chain.invoke({
    messages: messages,
    token_list: tokenListStringified,
  });

  return {
    messages: [result],
  };
};
