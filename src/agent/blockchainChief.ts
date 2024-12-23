import "dotenv/config";
import { RunnableSequence } from "@langchain/core/runnables";
import { solanaAgentState, Blockchain } from "../utils/state.js";
import {
  blockchainPrompt,
  blockchainParser,
} from "../prompts/blockchainChief.js";
import { gptModel } from "../utils/model.js";

const chain = RunnableSequence.from([
  blockchainPrompt,
  gptModel,
  blockchainParser,
]);

export const blockchainChiefNode = async (
  state: typeof solanaAgentState.State,
) => {
  const { messages } = state;

  const result = await chain.invoke({
    formatInstructions: blockchainParser.getFormatInstructions(),
    messages: messages,
  });

  const { isSolana, isBase, isAptos, isFuel } = result;

  // Convert boolean flags to Blockchain enum
  let blockchain = Blockchain.SOLANA; // Default to Solana as specified in the prompt
  if (isBase) blockchain = Blockchain.BASE;
  if (isAptos) blockchain = Blockchain.APTOS;
  if (isFuel) blockchain = Blockchain.FUEL;
  if (isSolana) blockchain = Blockchain.SOLANA;

  return {
    blockchain,
  };
};