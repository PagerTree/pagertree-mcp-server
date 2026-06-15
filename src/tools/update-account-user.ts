import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateAccountUser(server: McpServer) {
  server.tool(
    "update_account_user",
    `Update an existing account user. Only send fields you want to change - omitted fields are left as-is.

Tips:
- To add emails or phones, include them without an id
- To update existing emails or phones, include their id
- To remove an email or phone, include its id with \`_destroy: true\`
- To assign a notification rule, use \`list_notification_rules\` to find the id first
- Valid roles: admin, billing, broadcaster, communicator, integrator

Prerequisites:
- \`list_account_users\` or \`get_account_user\` → find the ID
- \`get_account_user\` → check current values before updating
- \`list_notification_rules\` → find notification_rule_id (if updating)
- \`list_teams\` → find member_team_ids (if updating)

Errors:
- 422 if removing the last admin role from the account

Related: \`get_account_user\` to read current state, \`delete_account_user\` to remove.`,
    {
      id: z.string().describe("Account user ID to update"),
      notification_rule_id: z.string().optional().describe("Notification rule ID to assign"),
      roles: z.object({
        admin: z.boolean().optional(),
        billing: z.boolean().optional(),
        broadcaster: z.boolean().optional(),
        communicator: z.boolean().optional(),
        integrator: z.boolean().optional(),
      }).optional().describe("Roles to assign"),
      member_team_ids: z.array(z.string()).optional().describe("Team IDs to assign as member"),
      name: z.string().optional().describe("Full name of the user"),
      notify_push: z.boolean().optional().describe("Enable push notifications"),
      notify_email: z.boolean().optional().describe("Enable email notifications"),
      notify_sms: z.boolean().optional().describe("Enable SMS notifications"),
      notify_voice: z.boolean().optional().describe("Enable voice call notifications"),
      emails_attributes: z.array(z.object({
        id: z.string().optional().describe("Existing email ID to update (omit to add new)"),
        email: z.string().optional().describe("Email address"),
        primary: z.boolean().optional().describe("Set as primary email"),
        _destroy: z.boolean().optional().describe("Set to true to remove this email"),
      })).optional().describe("Email addresses to add, update, or remove"),
      phones_attributes: z.array(z.object({
        id: z.string().optional().describe("Existing phone ID to update (omit to add new)"),
        phone: z.string().optional().describe("Phone number in E.164 format e.g. +15555555555"),
        primary: z.boolean().optional().describe("Set as primary phone"),
        _destroy: z.boolean().optional().describe("Set to true to remove this phone"),
      })).optional().describe("Phone numbers to add, update, or remove"),
    },
    async ({ id, notification_rule_id, roles, member_team_ids, name, notify_push, notify_email, notify_sms, notify_voice, emails_attributes, phones_attributes }) => {
      const result = await pagertree.updateAccountUser(id, {
        notification_rule_id,
        roles,
        member_team_ids,
        user_attributes: (name || notify_push !== undefined || notify_email !== undefined || notify_sms !== undefined || notify_voice !== undefined || emails_attributes || phones_attributes) ? {
          name,
          notify_push,
          notify_email,
          notify_sms,
          notify_voice,
          emails_attributes,
          phones_attributes,
        } : undefined,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}