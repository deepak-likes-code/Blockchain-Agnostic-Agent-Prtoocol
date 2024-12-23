import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { gptModel } from "../../utils/model.js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { tools as baseTools } from "../../utils/baseAgent.js";
import { solanaAgentState } from "../../utils/state.js";

const walletBalancePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful agent that checks wallet balances and can request testnet funds using the Coinbase Developer Platform. 

        Available actions:
        1. Use get_balance tool for checking specific asset balances
        2. Use request_faucet_funds tool to request testnet tokens
        
        When checking balances:
        - Return the balance information clearly
        
        When requesting testnet funds:
        - The funds will be sent to the configured wallet address`,
  ],
  new MessagesPlaceholder("messages"),
]);

const getWalletBalanceAgent = createReactAgent({
  llm: gptModel,
  tools: baseTools.filter((tool) =>
    ["get_balance", "request_faucet_funds"].includes(tool.name),
  ),
  stateModifier: walletBalancePrompt,
});

// Add node export similar to NFT agent
export const walletBalanceNode = async (
  state: typeof solanaAgentState.State,
) => {
  const { messages } = state;

  const result = await getWalletBalanceAgent.invoke({ messages });

  return { messages: [...result.messages] };
};

// Add handler function similar to NFT agent
export async function handleWalletOperations(userMessage: string) {
  try {
    const result = await getWalletBalanceAgent.invoke({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });
    return result;
  } catch (error) {
    console.error("Error in wallet operations:", error);
    throw error;
  }
}
