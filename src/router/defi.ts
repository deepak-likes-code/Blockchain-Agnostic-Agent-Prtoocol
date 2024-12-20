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
  }
  if (state.defiOptions.isBridge) {
    return "bridge";
  } else {
    return END;
  }
};
