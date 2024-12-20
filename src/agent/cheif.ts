import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { solanaAgentState } from "../utils/state.js";
import { prompt, parser } from "../prompts/chief.js";
import { gptModel } from "../utils/model.js";

const chain = RunnableSequence.from([prompt, gptModel, parser]);

export const cheifNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await chain.invoke({
    formatInstructions: parser.getFormatInstructions(),
    messages: messages,
  });

  const { isTechnicalQuery, isDefiQuery, isGeneralQuestion, isReadQuery } =
    result;

  return {
    isGeneralQuestion,
    isDefiQuery,
    isTechnicalQuery,
    isReadQuery,
  };
};

// const example = "how do i add a transaction in a solana smart contract?";

// const result = await chain.invoke({
//   messages: example,
//   formatInstructions: parser.getFormatInstructions(),
// });

// console.log({ result });
