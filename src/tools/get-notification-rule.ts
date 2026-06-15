import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetNotificationRule(server: McpServer) {
  server.tool(
    "get_notification_rule",
    `Get a single notification rule by ID. Includes name, enabled status, and the YAML rules definition.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Use this to inspect the YAML rules before modifying

Related: \`list_notification_rules\` to find IDs, \`update_notification_rule\` to modify, \`update_account_user\` to assign to a user.`,
    {
      id: z.string().describe("Notification rule ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getNotificationRule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}