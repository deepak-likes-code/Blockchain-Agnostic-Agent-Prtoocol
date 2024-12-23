import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { gptModel } from "../../utils/model.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { tools as baseTools } from "../../utils/baseAgent.js";
import { solanaAgentState } from "../../utils/state.js";

const tradeTransferPrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a trading and transfer specialist that can help with asset movements and trades.

        Available actions:
        1. Use transfer tool to move assets between addresses
        2. Use trade tool for trading assets (Mainnet only)
        3. Use deploy_token to create new ERC-20 tokens
        
        For transfers:
        - Verify addresses and amounts
        - Confirm sufficient balances
        
        For trades:
        - Check asset availability
        - Verify trading pairs
        - Confirm transaction details
        
        For token deployment:
        - Guide through token configuration
        - Verify deployment parameters`
    ],
    new MessagesPlaceholder("messages"),
]);

const tradeTransferAgent = createReactAgent({
    llm: gptModel,
    tools: baseTools.filter(tool => 
        ['transfer', 'trade', 'deploy_token'].includes(tool.name)
    ),
    stateModifier: tradeTransferPrompt,
});

export const tradeTransferNode = async (state: typeof solanaAgentState.State) => {
    const { messages } = state;

    const result = await tradeTransferAgent.invoke({ messages });

    return { messages: [...result.messages] };
}


export async function handleTradeTransfer(userMessage: string) {
    try {
        const result = await tradeTransferAgent.invoke({
            messages: [{
                role: "user",
                content: userMessage
            }]
        });
        return result;
    } catch (error) {
        console.error('Error in trade/transfer operations:', error);
        throw error;
    }
} 