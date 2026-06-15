import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateBroadcast(server: McpServer) {
  server.tool(
    "update_broadcast",
    "Update an existing broadcast. Only provide the fields you want to change.",
    {
      id: z.string().describe("Broadcast ID to update"),
      title: z.string().optional().describe("Title of the broadcast"),
      description: z.string().optional().describe("Description of the broadcast"),
      destination_team_ids: z.array(z.string()).optional().describe("Team IDs to send the broadcast to"),
      destination_account_user_ids: z.array(z.string()).optional().describe("Account user IDs to send the broadcast to"),
      tag_list: z.array(z.string()).optional().describe("Tags to attach to the broadcast"),
      response_requested: z.boolean().optional().describe("Whether a response is requested"),
      response_requested_by: z.string().optional().describe("Deadline for responses e.g. 2024-01-01 17:00:00"),
      select_specific_channels: z.boolean().optional().describe("If true, only send via specified channels"),
      notify_push: z.boolean().optional().describe("Send via push notifications"),
      notify_email: z.boolean().optional().describe("Send via email"),
      notify_sms: z.boolean().optional().describe("Send via SMS"),
      notify_slack: z.boolean().optional().describe("Send via Slack"),
      notify_whatsapp: z.boolean().optional().describe("Send via WhatsApp"),
    },
    async ({ id, title, description, destination_team_ids, destination_account_user_ids, tag_list, response_requested, response_requested_by, select_specific_channels, notify_push, notify_email, notify_sms, notify_slack, notify_whatsapp }) => {
      const result = await pagertree.updateBroadcast(id, {
        title,
        description,
        destination_team_ids,
        destination_account_user_ids,
        tag_list,
        response_requested,
        response_requested_by,
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
