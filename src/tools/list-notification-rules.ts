import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListNotificationRules(server: McpServer) {
  server.tool(
    "list_notification_rules",
    `List all notification rules. Notification rules are YAML configurations that define custom notification sequences for account users.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- Notification rules must be attached to an account user to take effect - use \`update_account_user\` to assign
- Notification rules only apply to Alert open messages, not broadcasts

Related: \`get_notification_rule\` to fetch a single record, \`create_notification_rule\` to create a new one, \`update_account_user\` to assign to a user.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of notification rules to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. name"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listNotificationRules({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}