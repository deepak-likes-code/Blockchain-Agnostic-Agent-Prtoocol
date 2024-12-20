import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { agent } from "../../utils/agent.js";

// Add new interface for API response
interface BirdeyeToken {
  address: string;
  symbol: string;
  name: string;
  price: number;
  volume24h: number;
  priceChange24h: number;
  marketCap: number;
}

export const get_trending_coins = tool(
  async ({ sortBy, limit }) => {
    try {
      const coins = await fetchTopCoins(sortBy, limit);

      return {
        status: "success",
        sortCriteria: sortBy,
        coins: coins.map((coin: BirdeyeToken) => ({
          symbol: coin.symbol,
          name: coin.name,
          price: coin.price,
          marketCap: coin.marketCap,
          volume24h: coin.volume24h,
          priceChange24h: coin.priceChange24h,
        })),
      };
    } catch (e: any) {
      throw new Error(`Failed to fetch top coins: ${e.message}`);
    }
  },
  {
    name: "get_trending_coins",
    description: "Get top Solana tokens sorted by various metrics",
    schema: z.object({
      sortBy: z
        .enum(["rank", "liquidity", "volume24hUSD"])
        .describe("Sorting criteria"),
      limit: z.number().min(1).max(100).describe("Number of coins to return"),
    }),
  },
);

async function fetchTopCoins(sortBy: string, limit: number) {
  const BIRDEYE_API_KEY = "27fe83013f824b69877fbd5deaff9c99";
  const sortType = "asc";

  const response = await fetch(
    `https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=${sortType}&offset=0&limit=${limit}`,
    {
      headers: {
        "X-API-KEY": BIRDEYE_API_KEY,
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.tokens.map((token: BirdeyeToken) => ({
    symbol: token.symbol,
    name: token.name,
    price: token.price,
    marketCap: token.marketCap,
    volume24h: token.volume24h,
    priceChange24h: token.priceChange24h,
  }));
}
