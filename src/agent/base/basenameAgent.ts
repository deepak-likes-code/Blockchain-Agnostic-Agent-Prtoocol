import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { gptModel } from "../../utils/model.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { tools as baseTools } from "../../utils/baseAgent.js";
import { solanaAgentState } from "../../utils/state.js";

const basenamePrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a Base name registration specialist that can help users register Base names for their wallets.

        Available actions:
        1. Use register_basename to register a new Base name
        
        When registering:
        - Verify name availability
        - Check registration requirements
        - Confirm registration status
        - Provide clear feedback on the process`
    ],
    new MessagesPlaceholder("messages"),
]);

const basenameAgent = createReactAgent({
    llm: gptModel,
    tools: baseTools.filter(tool => 
        ['register_basename'].includes(tool.name)
    ),
    stateModifier: basenamePrompt,
});



export const basenameNode = async (state: typeof solanaAgentState.State) => {
    const { messages } = state;

    const result = await basenameAgent.invoke({ messages });

    return { messages: [...result.messages] };
}

// const result = await handleBasenameRegistration("register the name 'testing1234' for this wallet on base-sepolia")
// console.log(result)