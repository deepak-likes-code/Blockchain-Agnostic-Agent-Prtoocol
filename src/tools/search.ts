import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

export const webSearchTool = new TavilySearchResults({ maxResults: 2 });
