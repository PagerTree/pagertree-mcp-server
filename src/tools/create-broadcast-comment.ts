import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateBroadcastComment(server: McpServer) {
  server.tool(
    "create_broadcast_comment",
    "Add a comment to a broadcast.",
    {
      id: z.string().describe("Broadcast ID to comment on"),
      body: z.string().describe("Comment text"),
    },
    async ({ id, body }) => {
      const result = await pagertree.createBroadcastComment(id, body);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
