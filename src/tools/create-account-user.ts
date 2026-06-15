import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateAccountUser(server: McpServer) {
  server.tool(
    "create_account_user",
    `Create a new user and associate them with this PagerTree account.

Required: name, email
Optional: phone (E.164 format e.g. +15555555555), roles, notification_rule_id, member_team_ids

Important:
- Always use this tool to create users - never use any other user creation endpoint
- PagerTree will automatically email the new user their login credentials
- If the email already exists in PagerTree, the user will receive an invite email to join this account

After creation:
- Use \`update_account_user\` to assign a notification_rule_id if needed
- Use \`update_team\` to add the user to additional teams, or pass member_team_ids at creation

Prerequisites:
- \`list_notification_rules\` → find notification_rule_id (optional)
- \`list_teams\` → find member_team_ids (optional)

Valid roles: admin, billing, broadcaster, communicator, integrator (all default to false if omitted)

Errors:
- 422 if name or email is missing
- 422 if email is invalid format

Related: \`update_account_user\` to modify, \`delete_account_user\` to remove, \`list_account_users\` to find existing users.`,
    {
      name: z.string().describe("Full name of the user"),
      email: z.string().email().describe("Primary email address of the user"),
      notification_rule_id: z.string().optional().describe("Notification rule ID to assign to this account user"),
      roles: z.object({
        admin: z.boolean().optional().describe("Admin role - full account access"),
        billing: z.boolean().optional().describe("Billing role - can manage billing"),
        broadcaster: z.boolean().optional().describe("Broadcaster role - can send broadcasts"),
        communicator: z.boolean().optional().describe("Communicator role - Can create stakeholder messages"),
        integrator: z.boolean().optional().describe("Integrator role - can manage integrations"),
      }).optional().describe("Roles to assign to this account user"),
      member_team_ids: z.array(z.string()).optional().describe("Team IDs to add this user to as a member"),
      notify_push: z.boolean().optional().describe("Enable push notifications"),
      notify_email: z.boolean().optional().describe("Enable email notifications"),
      notify_sms: z.boolean().optional().describe("Enable SMS notifications"),
      notify_voice: z.boolean().optional().describe("Enable voice call notifications"),
      phone: z.string().optional().describe("Primary phone number in E.164 format e.g. +15555555555"),
    },
    async ({ name, email, notification_rule_id, roles, member_team_ids, notify_push, notify_email, notify_sms, notify_voice, phone }) => {
      const result = await pagertree.createAccountUser({
        notification_rule_id,
        roles,
        member_team_ids,
        user_attributes: {
          name,
          notify_push,
          notify_email,
          notify_sms,
          notify_voice,
          emails_attributes: [{ email }],
          phones_attributes: phone ? [{ phone, primary: true }] : undefined,
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}