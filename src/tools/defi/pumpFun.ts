import { tool } from "@langchain/core/tools";
import { agent } from "../../utils/agent.js";
import { z } from "zod";
import { launchPumpFunToken } from "solana-agent-kit/dist/tools/launch_pumpfun_token.js";
import { dalleModel } from "../../utils/model.js";

export const mint_shit_coin = tool(
  async ({tokenName, tokenTicker, description, imagePrompt}) => {

try{

  const image= await dalleModel.images.generate({
    prompt:imagePrompt,
    n:1,
    size:"512x512",
  })

  const imageUrl=image.data[0].url

  console.log(imageUrl)

  const result= await launchPumpFunToken(
    agent,
  tokenName,
  tokenTicker,
  description,
  imageUrl!,
)

console.log(result)
return result




} catch(e){
  throw new Error(e as string);
}


  },

  {
    name: "mint_shit_coin",
    description:
      "create a new token using the launch_pumpfun_token tool",
    schema: z.object({
      tokenName: z
        .string()
        .describe("The name of the token to be created"),
      tokenTicker: z
        .string()
        .describe("The ticker symbol of the token to be created"),
      description: z
        .string()
        .describe("A description of the token to be created"),
      imagePrompt: z
        .string()
        .describe("The prompt for the image to be generated"),
    }),
  },
);
