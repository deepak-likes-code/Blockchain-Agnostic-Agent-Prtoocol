import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { BaseMessageLike } from "@langchain/core/messages";
import { messagesStateReducer } from "@langchain/langgraph";

export enum Blockchain {
  SOLANA = "solana",
  BASE = "base",
  APTOS = "aptos",
}

export const solanaAgentState = Annotation.Root({
  messages: Annotation<BaseMessage[], BaseMessageLike[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  input: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
  }),

  blockchain: Annotation<Blockchain>({
    reducer: (x, y) => y ?? x ?? Blockchain.SOLANA,
  }),

  isDefiQuery: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  isTechnicalQuery: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  isCurrentAffair: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  isGeneralQuestion: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),
});

// isSwap: Annotation<boolean>({
//   reducer: (x, y) => y ?? x ?? false,
//   default: () => false,
// }),

// isTransfer: Annotation<boolean>({
//   reducer: (x, y) => y ?? x ?? false,
//   default: () => false,
// }),

// isStaking: Annotation<boolean>({
//   reducer: (x, y) => y ?? x ?? false,
//   default: () => false,
// }),

// isTokenLaunch: Annotation<boolean>({
//   reducer: (x, y) => y ?? x ?? false,
//   default: () => false,
// }),

// isNFTLauch: Annotation<boolean>({
//   reducer: (x, y) => y ?? x ?? false,
//   default: () => false,
// }),

// isPumpFun: Annotation<boolean>({
//   reducer: (x, y) => y ?? x ?? false,
//   default: () => false,
// }),
