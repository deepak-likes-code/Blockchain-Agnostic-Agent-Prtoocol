import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatXAI } from "@langchain/xai";
import OpenAI from "openai";
import "dotenv/config";

export const gptMiniModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

export const gptModel = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
});

export const claudeSonnetModel = new ChatAnthropic({
  model: "claude-3-5-sonnet-20241022",
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const xAIModel = new ChatXAI({
  model: "grok-beta",
  apiKey: process.env.XAI_API_KEY,
});

export const dalleModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const url = await dalleModel.images
  .generate({
    prompt: "a cat as a image for a meme coin",
    n: 1,
    size: "1024x1024",
  })
  .then((res) => res.data[0].url);

console.log(url);
