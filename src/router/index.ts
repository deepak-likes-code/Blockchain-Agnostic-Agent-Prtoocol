import { END } from "@langchain/langgraph";
import { solanaAgentState } from "../utils/state.js";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

export const chiefRouter = async (state: typeof solanaAgentState.State) => {
  const { isDefiQuery, isGeneralQuestion, isTechnicalQuery } = state;

  if (isDefiQuery) {
    return "defiManager";
  } else if (isGeneralQuestion) {
    return "generalist";
  } else {
    return END;
  }
};
