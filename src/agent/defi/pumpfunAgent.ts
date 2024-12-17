import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { pumpfunPrompt, pumpfunParser } from "../../prompts/defi/pumpfun.js";
import { pumpfunTools } from "./tools/defi.js";

const modelBoundTool = gptModel.bindTools(pumpfunTools);

const chain = RunnableSequence.from([
  {
    messages: (input) => input.messages,
    formatInstructions: () => pumpfunParser.getFormatInstructions(),
  },
  pumpfunPrompt,
  gptModel,
  pumpfunParser,
]);

export const pumpfunNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await chain.invoke({
    messages: messages,
  });

  return {
    pumpfunDetails: {
      token: result.token,
      strategy: result.strategy,
      timeframe: result.timeframe,
      targetPrice: result.targetPrice,
    },
  };
};
