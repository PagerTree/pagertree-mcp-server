import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetRouter(server: McpServer) {
  server.tool(
    "get_router",
    "Get a single router by ID. Includes YAML rules and default receiver configuration.",
    {
      id: z.string().describe("Router ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getRouter(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
