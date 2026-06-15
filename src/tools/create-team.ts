import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateTeam(server: McpServer) {
  server.tool(
    "create_team",
    `Create a new team.

Required: name, at least 1 member_account_user_id, at least 1 admin_account_user_id (can be the same person)

After creation PagerTree automatically creates:
- A default Schedule for managing on-call events
- A default Escalation Policy for alert escalation

Use \`get_team\` after creation to find the auto-created schedule_id and escalation_policy_id.

Prerequisites:
- \`list_account_users\` → find member_account_user_ids and admin_account_user_ids

Tips:
- drop_notifications controls who is notified when an alert is dropped (no one acknowledged before escalation exhausted)
  - none: no notification
  - team_all: all team members
  - team_admins: team admins only
  - oncall_rotation: only users currently on-call
  - specific_users: specific account users (requires drop_notification_account_user_ids)
- handoff_notifications controls who is notified when the on-call rotation changes (same options as drop_notifications)

Errors:
- 422 if no member_account_user_ids provided
- 422 if no admin_account_user_ids provided

Related: \`update_team\` to modify, \`delete_team\` to remove, \`get_team\` to inspect after creation, \`create_event\` to add on-call events to the auto-created schedule.`,
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
