import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateIntegration(server: McpServer) {
  server.tool(
    "update_integration",
    `Update an existing integration. Only send fields you want to change - omitted fields are left as-is.

Prerequisites:
- \`list_integrations\` or \`get_integration\` → find the ID
- \`get_integration\` → check current values before updating

Tips:
- Use \`enable_integration\` or \`disable_integration\` for toggling enabled status
- Changing destinations (team_ids, router_ids, account_user_ids) replaces the existing destinations entirely

Errors:
- 422 if no destination provided

Related: \`get_integration\` to read current state, \`enable_integration\` / \`disable_integration\` to toggle, \`delete_integration\` to remove.`,
    {
      id: z.string().describe("Integration ID to update"),
      name: z.string().optional().describe("Name of the integration"),
      urgency: z.enum(["low", "medium", "high", "critical"]).optional().describe("Default urgency for alerts"),
      enabled: z.boolean().optional().describe("Whether the integration is enabled"),
      team_ids: z.array(z.string()).optional().describe("Team IDs to route alerts to by default"),
      router_ids: z.array(z.string()).optional().describe("Router IDs to route alerts to by default"),
      account_user_ids: z.array(z.string()).optional().describe("Account user IDs to route alerts to by default"),
      options: z.record(z.string(), z.unknown()).optional().describe("Additional option_ prefixed fields specific to this integration type. Fetch the meta.documentation_url from get_integration_type to see available options. Pass them as a flat object e.g. { option_send_resolved: true }"),
    },
    async ({ id, name, urgency, enabled, team_ids, router_ids, account_user_ids, options }) => {
      const result = await pagertree.updateIntegration(id, {
        name,
        urgency,
        enabled,
        team_ids,
        router_ids,
        account_user_ids,
        ...options,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}