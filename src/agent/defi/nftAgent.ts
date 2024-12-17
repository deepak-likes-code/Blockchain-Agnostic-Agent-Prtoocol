import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { nftPrompt, nftParser } from "../../prompts/defi/nft.js";
import { nftTools } from "./tools/defi.js";

const modelBoundTool = gptModel.bindTools(nftTools);

const chain = RunnableSequence.from([
  {
    messages: (input) => input.messages,
    formatInstructions: () => nftParser.getFormatInstructions(),
  },
  nftPrompt,
  gptModel,
  nftParser,
]);

export const nftNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await chain.invoke({
    messages: messages,
  });

  return {
    nftDetails: {
      collection: result.collection,
      action: result.action,
      price: result.price,
      quantity: result.quantity,
    },
  };
};
