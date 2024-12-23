import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { gptModel } from "../../utils/model.js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { tools as baseTools } from "../../utils/baseAgent.js";
import { solanaAgentState } from "../../utils/state.js";

const zoraPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a Zora platform specialist that can help with token operations using Zora's Wow Launcher.

        Available actions:
        1. Use wow_create_token to deploy tokens with bonding curves
        2. Use wow_buy_token to purchase Zora Wow ERC-20 memecoins
        3. Use wow_sell_token to sell Zora Wow ERC-20 memecoins
        
        For all operations:
        - Verify transaction parameters
        - Explain expected outcomes
        - Provide clear feedback on transaction status`,
  ],
  new MessagesPlaceholder("messages"),
]);

const zoraAgent = createReactAgent({
  llm: gptModel,
  tools: baseTools.filter((tool) =>
    ["wow_create_token", "wow_buy_token", "wow_sell_token"].includes(tool.name),
  ),
  stateModifier: zoraPrompt,
});

export async function handleZoraOperations(userMessage: string) {
  try {
    const result = await zoraAgent.invoke({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });
    return result;
  } catch (error) {
    console.error("Error in Zora operations:", error);
    throw error;
  }
}

export const zoraNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await zoraAgent.invoke({ messages });

  return { messages: [...result.messages] };
};

// const result = await zoraAgent.invoke({
//   messages: [
//     {
//       role: "user",
//       content:
//         "create a token with bonding curve with the token name as 'test' and the token symbol as 'TEST' ",
//     },
//   ],
// });

// console.log(result);
