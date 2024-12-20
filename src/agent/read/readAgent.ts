import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { get_top_traders } from "../../tools/analytics/getTraders.js";
import { get_trending_coins } from "../../tools/analytics/getTopCoins.js";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const readPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a blockchain analytics specialist that helps users get information about market trends, top traders, and popular tokens on Solana.
    
    You have access to the following tools:
    - get_trending_coins: Find trending tokens and their market movements
    - get_top_traders: Get information about top performing traders
    
    You can:
    1. Get information about top traders and their performance
    2. Find trending tokens and market movements
    3. Analyze market statistics and trends
    
    When processing requests:
    - Understand the specific metrics the user is interested in
    - Use appropriate timeframes for analysis
    - Present data in a clear, organized manner
    - Provide relevant context for the numbers`,
  ],
  new MessagesPlaceholder("messages"),
]);

const readGraph = createReactAgent({
  llm: gptModel,
  tools: [get_top_traders, get_trending_coins],
  stateModifier: readPrompt,
});

export const readAnalyticsNode = async (
  state: typeof solanaAgentState.State,
) => {
  const { messages } = state;

  const result = await readGraph.invoke({
    messages: messages,
  });

  return { messages: [...result.messages] };
};
