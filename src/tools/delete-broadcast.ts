import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteBroadcast(server: McpServer) {
  server.tool(
    "delete_broadcast",
    "Delete a broadcast permanently.",
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
