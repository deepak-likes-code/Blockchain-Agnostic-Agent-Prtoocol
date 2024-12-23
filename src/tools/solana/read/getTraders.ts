import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

export const get_top_traders = tool(
  async ({ timeframe, limit }) => {
    try {
      const traders = await fetchTopTraders(timeframe);

      // Filter only Solana traders and limit the results
      const solanaTraders = traders.items
        .filter((trader) => trader.network === "solana")
        .slice(0, limit);

      return {
        status: "success",
        timeframe,
        traders: solanaTraders.map((trader) => ({
          address: trader.address,
          volume: trader.volume,
          trades: trader.trade_count,
          profitLoss: trader.pnl,
        })),
      };
    } catch (e: any) {
      throw new Error(`Failed to fetch top traders: ${e.message}`);
    }
  },
  {
    name: "get_top_traders",
    description:
      "Get the top traders on Solana by volume within a specified timeframe",
    schema: z.object({
      timeframe: z
        .enum(["today", "yesterday", "1W"])
        .describe("Time period for analysis"),
      limit: z.number().min(1).max(100).describe("Number of traders to return"),
    }),
  },
);

interface TraderResponse {
  success: boolean;
  data: {
    items: {
      network: string;
      address: string;
      pnl: number;
      volume: number;
      trade_count: number;
    }[];
  };
}

async function fetchTopTraders(
  timeframe: string,
): Promise<TraderResponse["data"]> {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": process.env.BIRDEYE_API_KEY || "",
    },
  };

  const response = await fetch(
    `https://public-api.birdeye.so/trader/gainers-losers?type=${timeframe}&sort_by=PnL&sort_type=desc`,
    options,
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: TraderResponse = await response.json();
  if (!data.success) {
    throw new Error("API request was not successful");
  }

  return data.data;
}
