
import { AIMessage } from "@langchain/core/messages"
import { END } from "@langchain/langgraph"
import { solanaAgentState } from "../utils/state.js"

export const toolRouter= (state:typeof solanaAgentState.State)=>{

    const messages= state.messages

    const lastMessage = messages[messages.length-1] as AIMessage

    if (lastMessage?.tool_calls?.length || 0 > 0){
        return 'defi'
    }else{
        return END
    }

}
