import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { tokenList } from "../../helpers/tokens.js";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { lendingPrompt, lendingParser } from "../../prompts/defi/lending.js";
import { lendingTools } from "./tools/defi.js";

const modelBoundTool = gptModel.bindTools(lendingTools);

const chain = RunnableSequence.from([
  {
    messages: (input) => input.messages,
    formatInstructions: () => lendingParser.getFormatInstructions(),
  },
  lendingPrompt,
  gptModel,
  lendingParser,
]);

export const lendingNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;
  const tokenListStringified = JSON.stringify(tokenList);

  const result = await chain.invoke({
    messages: messages,
    token_list: tokenListStringified,
  });

  return {
    lendingDetails: {
      asset: result.asset,
      action: result.action,
      amount: result.amount,
      term: result.term,
      apy: result.apy,
    },
  };
};
