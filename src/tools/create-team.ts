import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateTeam(server: McpServer) {
  server.tool(
    "create_team",
    `Create a new team. A default schedule and escalation policy will be created automatically by PagerTree.

Tips:
- Requires at least 1 member and 1 admin account user ID (can be the same person)
- Use list_account_users to find account user IDs
- drop_notifications and handoff_notifications control who gets notified on alert drop/handoff`,
    {
      name: z.string().describe("Name of the team"),
      member_account_user_ids: z.array(z.string()).describe("Account user IDs with member role"),
      admin_account_user_ids: z.array(z.string()).describe("Account user IDs with admin role"),
      notes: z.string().optional().describe("Notes displayed for this team"),
      drop_notifications: z.enum(["none", "team_all", "team_admins", "oncall_rotation", "specific_users"]).optional().describe("Who to notify on alert drop"),
      handoff_notifications: z.enum(["none", "team_all", "team_admins", "oncall_rotation", "specific_users"]).optional().describe("Who to notify on on-call handoff"),
      drop_notification_account_user_ids: z.array(z.string()).optional().describe("Account user IDs for drop notifications when drop_notifications is specific_users"),
      handoff_notification_account_user_ids: z.array(z.string()).optional().describe("Account user IDs for handoff notifications when handoff_notifications is specific_users"),
    },
    async ({ name, member_account_user_ids, admin_account_user_ids, notes, drop_notifications, handoff_notifications, drop_notification_account_user_ids, handoff_notification_account_user_ids }) => {
      const result = await pagertree.createTeam({
        name,
        member_account_user_ids,
        admin_account_user_ids,
        notes,
        drop_notifications,
        handoff_notifications,
        drop_notification_account_user_ids,
        handoff_notification_account_user_ids,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
