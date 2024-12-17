import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { BaseMessageLike } from "@langchain/core/messages";
import { messagesStateReducer } from "@langchain/langgraph";

export enum Blockchain {
  SOLANA = "solana",
  BASE = "base",
  APTOS = "aptos",
}

// Separate DeFi options interface for better organization
export interface DefiOptions {
  isSwap: boolean;
  isTransfer: boolean;
  isStaking: boolean;
  isTokenLaunch: boolean;
  isNFTLaunch: boolean;
  isPumpFun: boolean;
}

// Define the state using Annotation.Root
export const solanaAgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  input: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  blockchain: Annotation<Blockchain>({
    reducer: (x, y) => y ?? x ?? Blockchain.SOLANA,
    default: () => Blockchain.SOLANA,
  }),

  isDefiQuery: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  isTechnicalQuery: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  isGeneralQuestion: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  defiOptions: Annotation<DefiOptions>({
    reducer: (x, y) => ({
      ...x,
      ...y,
    }),
    default: () => ({
      isSwap: false,
      isTransfer: false,
      isStaking: false,
      isTokenLaunch: false,
      isNFTLaunch: false,
      isPumpFun: false,
    }),
  }),
});
