import { END } from "@langchain/langgraph";
import { solanaAgentState } from "../utils/state.js";
import { Blockchain } from "../utils/state.js";

export const chiefRouter = async (state: typeof solanaAgentState.State) => {
  const { isBlockchainQuery, isGeneralQuestion } = state;

  if (isBlockchainQuery) {
    return "blockchainChief";
  } else if (isGeneralQuestion) {
    return "generalist";
  } else {
    return END;
  }
};

export const blockchainChiefRouter = async (
  state: typeof solanaAgentState.State,
) => {
  const { blockchain } = state;

  if (blockchain === Blockchain.SOLANA) {
    return "solanaManager";
  }
  if (blockchain === Blockchain.BASE) {
    return "base";
  } else {
    return END;
  }
};
