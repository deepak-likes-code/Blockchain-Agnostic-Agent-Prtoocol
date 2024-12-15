import { BaseMessage } from "@langchain/core/messages"
import { Annotation } from "@langchain/langgraph"

export const solanaAgentState= Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer:(x,y)=> x.concat(y)
      }),


      input: Annotation<string>({
        reducer: (x,y)=>y??x??""
      })



})
