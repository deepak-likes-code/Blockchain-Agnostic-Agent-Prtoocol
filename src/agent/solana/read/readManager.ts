import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { gptModel } from "../../../utils/model.js";
import { solanaAgentState } from "../../../utils/state.js";
import {
  readPrompt,
  readParser,
} from "../../../prompts/solana/read/readManager.js";

const chain = RunnableSequence.from([
  {
    messages: (input) => input.messages,
    formatInstructions: () => readParser.getFormatInstructions(),
  },
  readPrompt,
  gptModel,
  readParser,
]);

export const readNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await chain.invoke({
    messages: messages,
  });

  // Update the state with the classification result
  return {
    readOptions: {
      isTopTraders: result.isTopTraders,
      isTopCoins: result.isTopCoins,
      isMarketStats: result.isMarketStats,
      isTokenInfo: result.isTokenInfo,
    },
  };
};
