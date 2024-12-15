import { tool } from "@langchain/core/tools"
import { agent } from "../agent/test.js"
import { deploy_token } from "solana-agent-kit/dist/tools/deploy_token.js";

import { transfer } from "solana-agent-kit/dist/tools/transfer.js";
import { PublicKey } from "@solana/web3.js";
import {z} from 'zod'

export const solana_transfer = tool(async ( { to, amount }) => {
    const toAddress = new PublicKey(to);

    try {
        const result = await transfer(
            agent,
            toAddress,
            amount
          );
console.log({result})
          return result
          
    }catch(e){
        throw new Error('No data received from API');
    }

      


},{

    name:"solana_transfer",
    description:"call to transfer tokens from network to the other",
    schema:z.object({
        to:z.string(),
        amount:z.number()
    })

})






