// import "dotenv/config";
// import { RunnableSequence } from "@langchain/core/runnables";
// import { gptModel } from "../../utils/model.js";
// import { solanaAgentState } from "../../utils/state.js";
// import { nftPrompt, nftParser } from "../../prompts/defi/nft.js";
// import { MintNFTTool } from "../../tools/defi/mintNFT.js";
// import { createReactAgent } from "@langchain/langgraph/prebuilt";

// // Create tools array with the MintNFTTool
// const nftTools = [new MintNFTTool(solanaAgentState.agent)];

// const nftAgent = createReactAgent({
//   llm: gptModel,
//   tools: nftTools,
//   stateModifier: nftPrompt,
// });

// export const nftNode = async (state: typeof solanaAgentState.State) => {
//   const { messages } = state;

//   const result = await nftAgent.invoke({
//     messages: messages,
//   });

//   return { messages: [...result.messages] };
// };

// const chain = RunnableSequence.from([
//   {
//     messages: (input) => input.messages,
//     formatInstructions: () => nftParser.getFormatInstructions(),
//   },
//   nftPrompt,
//   gptModel,
//   nftParser,
// ]);

// // export const nftNode = async (state: typeof solanaAgentState.State) => {
// //   const { messages } = state;

// //   const result = await chain.invoke({
// //     messages: messages,
// //   });

// //   return {
// //     nftDetails: {
// //       collection: result.collection,
// //       action: result.action,
// //       price: result.price,
// //       quantity: result.quantity,
// //     },
// //   };
// // };
