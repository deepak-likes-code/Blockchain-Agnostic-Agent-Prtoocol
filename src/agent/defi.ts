import { ToolNode } from "@langchain/langgraph/prebuilt";
import { solana_transfer } from "../tools/defi/transfer.js";
import { swap_token } from "../tools/defi/swap.js";
import { mint_shit_coin } from "../tools/defi/pumpFun.js";

export const defiTools = [solana_transfer, swap_token, mint_shit_coin];

export const defiToolsNode = new ToolNode(defiTools);
