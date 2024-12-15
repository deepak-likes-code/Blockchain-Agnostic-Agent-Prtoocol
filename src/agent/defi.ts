import { ToolNode } from "@langchain/langgraph/prebuilt";
import { solana_transfer } from "../tools/defi/transfer.js";
import { swap_token } from "../tools/defi/swap.js";

export const defiTools = [solana_transfer, swap_token];

export const defiNode = new ToolNode(defiTools);
