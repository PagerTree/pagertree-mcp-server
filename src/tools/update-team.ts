import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateTeam(server: McpServer) {
  server.tool(
    "update_team",
    `Update an existing team. Only send fields you want to change - omitted fields are left as-is.

Important:
- Updating member_account_user_ids or admin_account_user_ids replaces the entire list
- Use escalation_policy_id to switch the team's active escalation policy
- Use schedule_id to switch the team's active schedule

Prerequisites:
- \`list_teams\` or \`get_team\` → find the ID
- \`get_team\` → check current values before updating
- \`list_account_users\` → find account user IDs if changing membership
- \`list_escalation_policies\` → find escalation_policy_id if switching policy
- \`list_schedules\` → find schedule_id if switching schedule

Tips:
- drop_notifications and handoff_notifications options: none, team_all, team_admins, oncall_rotation, specific_users
- If setting drop_notifications or handoff_notifications to specific_users, also provide the corresponding account user IDs

Errors:
- 422 if removing all admins from the team

Related: \`get_team\` to read current state, \`delete_team\` to remove.`,
    {
      id: z.string().describe("Team ID to update"),
      name: z.string().optional().describe("Name of the team"),
      notes: z.string().optional().describe("Notes displayed for this team"),
      escalation_policy_id: z.string().optional().describe("ID of the active escalation policy for this team"),
      schedule_id: z.string().optional().describe("ID of the active schedule for this team"),
      member_account_user_ids: z.array(z.string()).optional().describe("Account user IDs with member role"),
      admin_account_user_ids: z.array(z.string()).optional().describe("Account user IDs with admin role"),
      drop_notifications: z.enum(["none", "team_all", "team_admins", "oncall_rotation", "specific_users"]).optional().describe("Who to notify on alert drop"),
      handoff_notifications: z.enum(["none", "team_all", "team_admins", "oncall_rotation", "specific_users"]).optional().describe("Who to notify on on-call handoff"),
      drop_notification_account_user_ids: z.array(z.string()).optional().describe("Account user IDs for drop notifications when drop_notifications is specific_users"),
      handoff_notification_account_user_ids: z.array(z.string()).optional().describe("Account user IDs for handoff notifications when handoff_notifications is specific_users"),
    },
    async ({ id, name, notes, escalation_policy_id, schedule_id, member_account_user_ids, admin_account_user_ids, drop_notifications, handoff_notifications, drop_notification_account_user_ids, handoff_notification_account_user_ids }) => {
      const result = await pagertree.updateTeam(id, {
        name,
        notes,
        escalation_policy_id,
        schedule_id,
        member_account_user_ids,
        admin_account_user_ids,
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
