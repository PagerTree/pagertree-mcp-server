import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteBroadcast(server: McpServer) {
  server.tool(
    "delete_broadcast",
    `Permanently delete a broadcast. Cannot be undone.

Prerequisites:
- \`get_broadcast\` → confirm correct record before deleting

Related: \`list_broadcasts\` to find IDs.`,
    {
      id: z.string().describe("Broadcast ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteBroadcast(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
