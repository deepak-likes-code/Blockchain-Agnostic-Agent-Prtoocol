import "dotenv/config";
import { gptModel } from "../../utils/model.js";
import { solanaAgentState } from "../../utils/state.js";
import { pumpfunPrompt } from "../../prompts/defi/pumpfun.js";
import { pumpfunTools } from "./tools/defi.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const pumpfunGraph = createReactAgent({
  llm: gptModel,
  tools: pumpfunTools,
  stateModifier: pumpfunPrompt,
});

export const pumpfunNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await pumpfunGraph.invoke({
    messages: messages,
  });

  return { messages: [...result.messages] };
};

// const result = await pumpfunGraph.invoke({
//   messages:
//     "Create a token called $MCAT with the description 'The first feline-powered cryptocurrency that promises to take your investments to the moon!' and the image prompt 'A cartoon cat wearing an astronaut helmet, sitting on the moon with Earth visible in the background, digital art style'",
// });

// console.log({ result });
