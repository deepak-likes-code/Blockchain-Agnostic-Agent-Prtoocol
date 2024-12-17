import { HumanMessage } from "@langchain/core/messages";

export const swapMessage = {
  messages: [new HumanMessage("swap 1 USDC to SOL")],
};

export const transferMessage = {
  messages: [
    new HumanMessage(
      "trensfer 1000 bonk to address DZbJiJ2Uiwe3g53KBhJZ4ftdcUJGaVZNyp1ua2saguXC ",
    ),
  ],
};

export const generalMessage = {
  messages: [new HumanMessage("who is the richest person in mexico? ")],
};

export const pumpFun = {
  messages: [
    new HumanMessage(
      "mint a meme coin on pump fun called catsAreGods with the ticker $CATGOD and the image of cat with an aura ",
    ),
  ],
};
