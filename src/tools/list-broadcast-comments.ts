import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListBroadcastComments(server: McpServer) {
  server.tool(
    "list_broadcast_comments",
    "List all comments on a broadcast.",
    {
      id: z.string().describe("Broadcast ID"),
    },
    async ({ id }) => {
      const result = await pagertree.listBroadcastComments(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
