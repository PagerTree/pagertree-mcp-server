import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteNotificationRule(server: McpServer) {
  server.tool(
    "delete_notification_rule",
    `Permanently delete a notification rule. Cannot be undone.

Important:
- If this rule is attached to any account users, those users will fall back to their default notification channels immediately
- Use \`list_account_users\` to check which users are using this rule before deleting

Prerequisites:
- \`get_notification_rule\` → confirm correct record before deleting
- \`list_account_users\` → check which users have this rule attached

Related: \`update_notification_rule\` to modify instead of deleting, \`list_notification_rules\` to find IDs.`,
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