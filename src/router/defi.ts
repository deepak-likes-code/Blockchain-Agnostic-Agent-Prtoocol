import { AIMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";
import { solanaAgentState } from "../utils/state.js";

export const defiTeamRouter = (state: typeof solanaAgentState.State) => {
  if (state.defiOptions.isSwap) {
    return "transferSwap";
  } else {
    return END;
  }

  // } else if (state.defiOptions.isTransfer) {
  //   return "transferSwap";
  // } else if (state.defiOptions.isStaking) {
  //   return "lending";
  // } else if (state.defiOptions.isTokenLaunch) {
  //   return "pumpfun";
  // } else if (state.defiOptions.isNFTLaunch) {
  //   return "nft";
  // }
};

export const transferSwapRouter = (state: typeof solanaAgentState.State) => {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  if (lastMessage?.tool_calls?.length || 0 > 0) {
    return "transferSwapTools";
  } else {
    return "transferSwap";
  }
};
