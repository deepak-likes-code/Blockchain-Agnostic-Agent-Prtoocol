import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config'
import { SolanaAgentKit, createSolanaTools } from 'solana-agent-kit';
import { RunnableSequence } from "@langchain/core/runnables";
import {tool} from "@langchain/core/tools";
import { solana_transfer, swap_token } from "../tools/index.js";
import { Annotation, END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { AIMessage, BaseMessage,BaseMessageLike, HumanMessage } from "@langchain/core/messages";
import { tokenList } from "../utils/tokens.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";



const solanaAgentState= Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer:(x,y)=> x.concat(y)
      }),


      input: Annotation<string>({
        reducer: (x,y)=>y??x??""
      })



})


// Initialize with private key and optional RPC URL
export const agent = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
  process.env.SOLANA_MAINNET_RPC,
  process.env.OPENAI_API_KEY!
);

// Create LangChain tools
const tools = [solana_transfer, swap_token]


const model= new ChatOpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    model:'gpt-4o'
})





const modelBoundTool= model.bindTools(tools)
const prompt =  ChatPromptTemplate.fromMessages([[
    "system",
    `
    You are an agent that is an expert in Solana transactions and can execute blockchain transactions using the available tools based on user input. When processing token amounts:

    1. Use EXACTLY the decimal amount specified by the user without any modifications
    2. Do not round or adjust the numbers
    3. Maintain precise decimal places as provided in the user input
    4. Select input and output token mints from this list of supported tokens:

    {token_list}

    Example:
    - If user says "0.01 SOL", use exactly 0.01 (not 0.010 or 0.0100)
    - If user says "1.234 USDC", use exactly 1.234 (not 1.23 or 1.2340)
    `
],

  new MessagesPlaceholder("messages")
]
);

  const chain= RunnableSequence.from([
    prompt,
    modelBoundTool
  ])


  const callNode= async(state:typeof solanaAgentState.State)=>{

    const {input, messages}= state

    const lastMessage = messages[messages.length - 1];

    const tokenListStringified= JSON.stringify(tokenList)

    const result= await chain.invoke({
        messages:messages,
         token_list:tokenListStringified
        })

    return {messages:[result]}



  }


  const toolRouter= (state:typeof solanaAgentState.State)=>{

    const messages= state.messages

    const lastMessage = messages[messages.length-1] as AIMessage

    if (lastMessage?.tool_calls?.length || 0 > 0){
        return 'defi'
    }else{
        return END
    }

}

  
  const defiNode= new ToolNode(tools)

//   const result =await chain.invoke({
//     user_input:"transfer 1 sol to fdsahfldaskjfl"
//   })
// console.log({result})






const workflow= new StateGraph(solanaAgentState)
.addNode("manager",callNode)
.addNode("defi",defiNode)
.addEdge(START,"manager")
.addConditionalEdges("manager",toolRouter)
.addEdge("defi","manager")

const checkpointer = new MemorySaver()

export const graph= workflow.compile()
const checkpointConfig = { configurable: { thread_id: "thread" } };



const swapMessage= { messages:
    [new HumanMessage("swap 0.001 sol to USDC")]
}


const transferMessage= { messages:
    [new HumanMessage("trensfer 1000 bonk to address DZbJiJ2Uiwe3g53KBhJZ4ftdcUJGaVZNyp1ua2saguXC ")]
}


// const result= await graph.invoke(transferMessage)



// console.log(result)