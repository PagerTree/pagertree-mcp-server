import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteRouter(server: McpServer) {
  server.tool(
    "delete_router",
    "Delete a router permanently.",
    {
      id: z.string().describe("Router ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteRouter(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
