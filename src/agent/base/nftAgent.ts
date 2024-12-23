import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { gptModel } from "../../utils/model.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { tools as baseTools } from "../../utils/baseAgent.js";
import { solanaAgentState } from "../../utils/state.js";

const nftPrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an NFT operations specialist that can help with minting and deploying NFTs using the Coinbase Developer Platform.

        Available actions:
        1. Use mint_nft tool to mint NFTs from existing contracts
        2. Use deploy_nft tool to deploy new NFT contracts
        
        When minting NFTs:
        - Ensure all required parameters are provided
        - Verify the contract address is valid
        
        When deploying NFT contracts:
        - Guide users through the configuration process
        - Explain the deployment status clearly`
    ],
    new MessagesPlaceholder("messages"),
]);

const nftAgent = createReactAgent({
    llm: gptModel,
    tools: baseTools.filter(tool => 
        ['mint_nft', 'deploy_nft'].includes(tool.name)
    ),
    stateModifier: nftPrompt,
});


export const nftNode = async (state: typeof solanaAgentState.State) => {
    const { messages } = state;

    const result = await nftAgent.invoke({ messages });

    return { messages: [...result.messages] };
}

export async function handleNFTOperations(userMessage: string) {
    try {
        const result = await nftAgent.invoke({
            messages: [{
                role: "user",
                content: userMessage
            }]
        });
        return result;
    } catch (error) {
        console.error('Error in NFT operations:', error);
        throw error;
    }
} 