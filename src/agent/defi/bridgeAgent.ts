import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import {
  bridge_usdc_auto,
  bridge_usdc_manual,
  complete_partial_transfer,
} from "../../tools/defi/bridge_test.js";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

const bridgePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a cross-chain bridge specialist that helps users move their assets between different blockchain networks.
    Currently, you can help users bridge USDC from Solana to Base using Wormhole.
    
    When processing bridge requests:
    1. Extract the amount to bridge
    2. Validate the destination address format
    3. Use the bridge_usdc tool to execute the transfer
    4. Provide clear confirmation and next steps to the user

    Remember:
    - Only handle USDC bridging requests
    - Ensure destination addresses are valid Base addresses (0x format)
    - Maintain precision in amount handling
    - Provide clear transaction status updates`,
  ],
  new MessagesPlaceholder("messages"),
]);

const bridgeGraph = createReactAgent({
  llm: gptModel,
  tools: [bridge_usdc_auto, bridge_usdc_manual],
  stateModifier: bridgePrompt,
});

export const bridgeNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await bridgeGraph.invoke({
    messages: messages,
  });

  return { messages: [...result.messages] };
};

const messages = [
  new HumanMessage(
    "Can you bridge 1 USDC from Solana to 0xc68698C7baEa3fcf1fA615CC9bDE67cb812F8362 on base manually",
  ),
];

const result = await bridgeGraph.invoke({ messages });

console.log(result);
