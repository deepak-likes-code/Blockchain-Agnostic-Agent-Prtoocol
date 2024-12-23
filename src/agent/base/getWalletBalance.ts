import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { gptModel } from "../../utils/model.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { tools as baseTools } from "../../utils/baseAgent.js";


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
        - The funds will be sent to the configured wallet address`
    ],
    new MessagesPlaceholder("messages"),
]);

const getWalletBalanceAgent = createReactAgent({
    llm: gptModel,
    tools: [...baseTools],
    stateModifier: walletBalancePrompt,
});

// Add error handling around the balance check
try {
    const result = await getWalletBalanceAgent.invoke({
        messages: [{
            role: "user",
            content: "get more test net eth for this wallet "
        }]
    });
    console.log('Wallet balance result:', result);
} catch (error) {
    console.error('Error checking wallet balance:', error);
    throw error;
}
