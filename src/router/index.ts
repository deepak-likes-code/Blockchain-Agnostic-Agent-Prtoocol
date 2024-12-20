import { END } from "@langchain/langgraph";
import { solanaAgentState } from "../utils/state.js";

export const chiefRouter = async (state: typeof solanaAgentState.State) => {
  const { isDefiQuery, isGeneralQuestion, isTechnicalQuery, isReadQuery } =
    state;

  if (isDefiQuery) {
    return "defiManager";
  } else if (isGeneralQuestion) {
    return "generalist";
  } else if (isReadQuery) {
    return "readManager";
  } else {
    return END;
  }
};
