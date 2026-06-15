import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateBroadcast(server: McpServer) {
  server.tool(
    "create_broadcast",
    `Create and send a new broadcast to teams or account users.

Required: title, at least 1 destination (destination_team_ids or destination_account_user_ids)
Optional: description, response_requested, channels, tags

Prerequisites:
- \`list_teams\` → find destination_team_ids
- \`list_account_users\` → find destination_account_user_ids

Tips:
- Broadcast is sent immediately on creation
- If response_requested is true, at least 1 broadcast_response_options_attributes value is required e.g. "Yes", "No"
- response_requested_by is a deadline datetime for responses e.g. "2024-01-01 17:00:00"
- If select_specific_channels is false (default), recipients are notified via their notification rule channels
- If select_specific_channels is true, only the channels you specify (notify_push, notify_email, notify_sms, notify_slack, notify_whatsapp) are used

Errors:
- 422 if no destination is provided
- 422 if response_requested is true but no response options are provided

Related: \`update_broadcast\` to modify, \`delete_broadcast\` to remove, \`create_broadcast_comment\` to add a comment.`,
    {
      title: z.string().describe("Title of the broadcast"),
      destination_team_ids: z.array(z.string()).optional().describe("Team IDs to send the broadcast to. Use list_teams to find IDs."),
      destination_account_user_ids: z.array(z.string()).optional().describe("Account user IDs to send the broadcast to. Use list_account_users to find IDs."),
      description: z.string().optional().describe("Description or body of the broadcast"),
      tag_list: z.array(z.string()).optional().describe("Tags to attach to the broadcast"),
      response_requested: z.boolean().optional().describe("Whether a response is requested from recipients"),
      response_requested_by: z.string().optional().describe("Deadline for responses e.g. 2024-01-01 17:00:00"),
      broadcast_response_options_attributes: z.array(z.object({
        value: z.string().describe("Response option text e.g. Yes, No, Maybe"),
      })).optional().describe("Response options (required if response_requested is true)"),
      select_specific_channels: z.boolean().optional().describe("If true, only send via specified channels below"),
      notify_push: z.boolean().optional().describe("Send via push notifications (only if select_specific_channels is true)"),
      notify_email: z.boolean().optional().describe("Send via email (only if select_specific_channels is true)"),
      notify_sms: z.boolean().optional().describe("Send via SMS (only if select_specific_channels is true)"),
      notify_slack: z.boolean().optional().describe("Send via Slack (only if select_specific_channels is true)"),
      notify_whatsapp: z.boolean().optional().describe("Send via WhatsApp (only if select_specific_channels is true)"),
    },
    async ({ title, destination_team_ids, destination_account_user_ids, description, tag_list, response_requested, response_requested_by, broadcast_response_options_attributes, select_specific_channels, notify_push, notify_email, notify_sms, notify_slack, notify_whatsapp }) => {
      const result = await pagertree.createBroadcast({
        title,
        destination_team_ids,
        destination_account_user_ids,
        description,
        tag_list,
        response_requested,
        response_requested_by,
        broadcast_response_options_attributes,
        select_specific_channels,
        notify_push,
        notify_email,
        notify_sms,
        notify_slack,
        notify_whatsapp,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
