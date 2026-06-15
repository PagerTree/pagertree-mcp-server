import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteAlert(server: McpServer) {
  server.tool(
    "delete_alert",
    "Delete an alert permanently.",
    {
      id: z.string().describe("Alert ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}