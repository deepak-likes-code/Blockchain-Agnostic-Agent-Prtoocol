import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { BaseMessageLike } from "@langchain/core/messages";
import { messagesStateReducer } from "@langchain/langgraph";

export enum Blockchain {
  SOLANA = "solana",
  BASE = "base",
  APTOS = "aptos",
  FUEL = "fuel",
}

// Separate DeFi options interface for better organization
export interface DefiOptions {
  isSwap: boolean;
  isTransfer: boolean;
  isStaking: boolean;
  isTokenLaunch: boolean;
  isNFTLaunch: boolean;
  isPumpFun: boolean;
  isBridge: boolean;
}

// Add BaseOptions interface after DefiOptions
export interface BaseOptions {
  isBasename: boolean;
  isNFTOperation: boolean;
  isTradeTransfer: boolean;
  isWalletBalance: boolean;
  isZoraOperation: boolean;
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

  isBlockchainQuery: Annotation<boolean>({
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
  isReadQuery: Annotation<boolean>({
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
      isBridge: false,
    }),
  }),

  // Add baseOptions after defiOptions
  baseOptions: Annotation<BaseOptions>({
    reducer: (x, y) => ({
      ...x,
      ...y,
    }),
    default: () => ({
      isBasename: false,
      isNFTOperation: false,
      isTradeTransfer: false,
      isWalletBalance: false,
      isZoraOperation: false,
    }),
  }),
});
