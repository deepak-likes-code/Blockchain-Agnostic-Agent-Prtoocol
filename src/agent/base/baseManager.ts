import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { basePrompt, baseParser } from "../../prompts/base/baseManager.js";

const chain = RunnableSequence.from([
  {
    messages: (input) => input.messages,
    formatInstructions: () => baseParser.getFormatInstructions(),
  },
  basePrompt,
  gptModel,
  baseParser,
]);

export const baseNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await chain.invoke({
    messages: messages,
  });

  // Update the state with the classification result
  return {
    baseOptions: {
      isBasename: result.isBasename,
      isNFTOperation: result.isNFTOperation,
      isTradeTransfer: result.isTradeTransfer,
      isWalletBalance: result.isWalletBalance,
      isZoraOperation: result.isZoraOperation,
      isBridge: result.isBridge,
    },
  };
};
