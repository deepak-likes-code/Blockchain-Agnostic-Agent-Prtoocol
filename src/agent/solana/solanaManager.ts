import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import {
  solanaPrompt,
  solanaParser,
} from "../../prompts/solana/solanaManager.js";

const chain = RunnableSequence.from([
  {
    messages: (input) => input.messages,
    formatInstructions: () => solanaParser.getFormatInstructions(),
  },
  solanaPrompt,
  gptModel,
  solanaParser,
]);

export const solanaManagerNode = async (
  state: typeof solanaAgentState.State,
) => {
  const { messages } = state;

  const result = await chain.invoke({
    messages: messages,
  });

  // Update the state with the classification result
  return {
    solanaOptions: {
      isReadOperation: result.isReadOperation,
      isDefiAction: result.isDefiAction,
    },
  };
};
