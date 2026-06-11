import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteNotificationRule(server: McpServer) {
  server.tool(
    "delete_notification_rule",
    "Delete a notification rule permanently.",
    {
      id: z.string().describe("Notification rule ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteNotificationRule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}