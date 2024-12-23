import { AIMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";
import { solanaAgentState } from "../utils/state.js";

export const solanaDefiTeamRouter = (state: typeof solanaAgentState.State) => {
  if (state.defiOptions.isSwap) {
    return "transferSwap";
  }
  if (state.defiOptions.isTransfer) {
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

export const solanaManagerRouter = (state: typeof solanaAgentState.State) => {
  if (state.solanaOptions.isReadOperation) {
    return "readManager";
  }
  if (state.solanaOptions.isDefiAction) {
    return "defiManager";
  } else {
    return END;
  }
};

export const baseRouter = (state: typeof solanaAgentState.State) => {
  if (state.baseOptions.isBasename) {
    return "basename";
  }
  if (state.baseOptions.isNFTOperation) {
    return "baseNft";
  }
  if (state.baseOptions.isTradeTransfer) {
    return "baseTradeTransfer";
  }
  if (state.baseOptions.isZoraOperation) {
    return "baseZora";
  }
  if (state.baseOptions.isWalletBalance) {
    return "baseWalletBalance";
  } else {
    return END;
  }
};
