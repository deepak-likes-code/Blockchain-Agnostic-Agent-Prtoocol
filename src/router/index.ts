import { END } from "@langchain/langgraph";
import { solanaAgentState } from "../utils/state.js";
import { Blockchain } from "../utils/state.js";

export const chiefRouter = async (state: typeof solanaAgentState.State) => {
  const { isDefiQuery, isGeneralQuestion, isTechnicalQuery, isReadQuery } =
    state;

  if (isDefiQuery) {
    return "blockchainChief";
  } else if (isGeneralQuestion) {
    return "generalist";
  } else if (isReadQuery) {
    return "readManager";
  } else {
    return END;
  }
};

export const blockchainChiefRouter = async (
  state: typeof solanaAgentState.State,
) => {
  const { blockchain } = state;

  if (blockchain === Blockchain.SOLANA) {
    return "defiManager";
  }
  if (blockchain === Blockchain.BASE) {
    return "base";
  } else {
    return END;
  }
};