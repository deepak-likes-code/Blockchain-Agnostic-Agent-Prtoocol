import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { baseAgent } from "../../utils/agent.js";
import { gptModel } from "../../utils/model.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const cdpToolkit = new CdpToolkit(baseAgent);
const tools = cdpToolkit.getTools();



const walletBalancePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful agent that can check wallet balances using the Coinbase Developer Platform AgentKit.
    
    When processing balance requests:
    1. Extract the wallet address if provided
    2. Use the appropriate tools to fetch the balance
    3. Present the balance information clearly to the user
    
    Remember:
    - Support multiple token balance checks
    - Format amounts with proper decimals
    - Provide clear and concise responses`,
  ],
  new MessagesPlaceholder("messages"),
]);

const getWalletBalanceAgent = createReactAgent({
    llm: gptModel,
    tools,
    stateModifier: walletBalancePrompt,
});

const result = await getWalletBalanceAgent.invoke({
    message: "What is the balance of my wallet?",
});

console.log(result);