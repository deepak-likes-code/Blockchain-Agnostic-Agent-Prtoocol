import { AIMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";
import { solanaAgentState } from "../utils/state.js";

export const defiTeamRouter = (state: typeof solanaAgentState.State) => {
  if (state.defiOptions.isSwap) {
    return "transferSwap";
  }
  if (state.defiOptions.isPumpFun) {
    return "pumpFun";
  }
  if (state.defiOptions.isStaking) {
    return "lending";
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
