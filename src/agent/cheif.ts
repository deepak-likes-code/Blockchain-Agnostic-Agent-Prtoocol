import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { solanaAgentState } from "../utils/state.js";
import { prompt, parser } from "../prompts/chief.js";
import { defiTools } from "./defi.js";
import { gptMiniModel, gptModel } from "../utils/model.js";
import { HumanMessage } from "@langchain/core/messages";

const chain = RunnableSequence.from([prompt, gptModel, parser]);

export const callNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await chain.invoke({
    formatInstructions: parser.getFormatInstructions(),
    messages: messages,
  });

  const { isTechnicalQuery, isDefiQuery, isCurrentAffair, isGeneralQuestion } =
    result;

  return { isGeneralQuestion, isCurrentAffair, isDefiQuery, isTechnicalQuery };
};

// const example = "how do i add a transaction in a solana smart contract?";

// const result = await chain.invoke({
//   messages: example,
//   formatInstructions: parser.getFormatInstructions(),
// });

// console.log({ result });
