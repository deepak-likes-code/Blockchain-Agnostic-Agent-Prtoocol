
import {  PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { 
    SystemProgram, 
    Transaction,
    TransactionInstruction
  } from "@solana/web3.js";
  import { 
    getAssociatedTokenAddress, 
    createTransferInstruction,
    getMint,
    createAssociatedTokenAccountInstruction,
    getAccount
  } from "@solana/spl-token";
  import { SolanaAgentKit } from "solana-agent-kit";
import {z} from 'zod'
import { tool } from "@langchain/core/tools"
import { agent } from "../../utils/agent.js";




export const solana_transfer = tool(async ( { to, amount,mint }) => {
    const toAddress = new PublicKey(to);
    const mintAddress= new PublicKey(mint)

    try {
        const result = await transferFunction(
            agent,
            toAddress,
            amount,
            mintAddress
          );
console.log({result})
          return result
          
    }catch(e){
        throw new Error(e as string);
    }

      


},{

    name:"solana_transfer",
    description:"call to transfer tokens from network to the other",
    schema:z.object({
        to:z.string().describe("the destination address"),
        amount:z.number(),
        mint:z.string().describe("the mint address of the token that is being transferred")
    })

})





const transferFunction=async(
    agent: SolanaAgentKit,
    to: PublicKey,
    amount: number,
    mint?: PublicKey
  )=>{
    try {
      if (!mint) {
        // Transfer native SOL
        const balance = await agent.connection.getBalance(agent.wallet_address);
        const transferAmount = amount * LAMPORTS_PER_SOL;
        
        if (balance < transferAmount) {
          throw new Error('Insufficient SOL balance');
        }
  
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: agent.wallet_address,
            toPubkey: to,
            lamports: transferAmount
          })
        );
  
        return await agent.connection.sendTransaction(
          transaction,
          [agent.wallet]
        );
      } else {
        // Transfer SPL token
        const fromAta = await getAssociatedTokenAddress(mint, agent.wallet_address);
        const toAta = await getAssociatedTokenAddress(mint, to);
        
        // Get mint info to determine decimals
        const mintInfo = await getMint(agent.connection, mint);
        const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
  
        // Check sender's token balance
        try {
          const fromAccount = await getAccount(agent.connection, fromAta);
          if (Number(fromAccount.amount) < adjustedAmount) {
            throw new Error('Insufficient token balance');
          }
        } catch (error) {
          throw new Error('Source token account does not exist or is invalid');
        }
  
        // Check if recipient's token account exists
        const instructions: TransactionInstruction[] = [];
        
        try {
          await getAccount(agent.connection, toAta);
        } catch (error) {
          // If the account doesn't exist, add instruction to create it
          instructions.push(
            createAssociatedTokenAccountInstruction(
              agent.wallet_address, // payer
              toAta,               // ata
              to,                  // owner
              mint                 // mint
            )
          );
        }
  
        // Add transfer instruction
        instructions.push(
          createTransferInstruction(
            fromAta,
            toAta,
            agent.wallet_address,
            adjustedAmount
          )
        );
  
        const transaction = new Transaction().add(...instructions);
  
        // Send transaction
        return await agent.connection.sendTransaction(
          transaction,
          [agent.wallet]
        );
      }
    } catch (error: any) {
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }