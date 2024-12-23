import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { tokenList } from "../../../helpers/tokens.js";
import { gptModel } from "../../../utils/model.js";
import { solanaAgentState } from "../../../utils/state.js";

import {
  defiPrompt,
  defiParser,
} from "../../../prompts/solana/defi/defiManager.js";

const chain = RunnableSequence.from([
  {
    messages: (input) => input.messages,
    formatInstructions: () => defiParser.getFormatInstructions(),
  },
  defiPrompt,
  gptModel,
  defiParser,
]);

export const defiNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;
  const tokenListStringified = JSON.stringify(tokenList);

  const result = await chain.invoke({
    messages: messages,
    token_list: tokenListStringified,
  });

  // Update the state with the classification result
  return {
    defiOptions: {
      isSwap: result.isSwap,
      isTransfer: result.isTransfer,
      isStaking: result.isStaking,
      isTokenLaunch: result.isTokenLaunch,
      isNFTLaunch: result.isNFTLaunch,
      isPumpFun: result.isPumpFun,
      isBridge: result.isBridge,
    },
  };
};
