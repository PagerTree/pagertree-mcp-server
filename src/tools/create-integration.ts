import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateIntegration(server: McpServer) {
  server.tool(
    "create_integration",
`Create a new integration. Integrations connect PagerTree to 3rd party tools and create alerts when triggered.

Required: name, urgency, integration_type_id, at least 1 destination (team_ids, router_ids, or account_user_ids)

Prerequisites:
- \`list_integration_types\` → find a valid integration_type_id
- \`list_teams\` → find team_ids
- \`list_routers\` → find router_ids
- \`list_account_users\` → find account_user_ids

Tips:
- urgency: low | medium | high | critical - sets the default urgency for alerts created by this integration
- After creation the response will include a webhook URL to configure in the 3rd party tool
- Integrations are enabled by default
- Use \`get_integration_type\` and fetch \`meta.documentation_url\` to see all available \`option_\` prefixed fields for this integration type before creating

Alert aggregation:
- PagerTree deduplicates incoming alerts by \`thirdparty_id\` - if an alert with the same thirdparty_id already exists in open|acknowledged|dropped state, the dedup count is incremented instead of creating a new alert
- Use \`list_logs\` with the integration ID as owner_id to troubleshoot incoming requests

Errors:
- 422 if no destination provided
- 422 if integration_type_id is invalid

Related: \`update_integration\` to modify, \`delete_integration\` to remove, \`disable_integration\` to temporarily stop, \`list_integration_types\` to find valid types.`,
    {
      name: z.string().describe("Name of the integration"),
      urgency: z.enum(["low", "medium", "high", "critical"]).describe("Default urgency for alerts created by this integration"),
      integration_type_id: z.string().describe("Integration type ID. Use list_integration_types to find valid IDs."),
      enabled: z.boolean().optional().default(true).describe("Whether the integration is enabled"),
      team_ids: z.array(z.string()).optional().describe("Team IDs to route alerts to by default. Use list_teams to find IDs."),
      router_ids: z.array(z.string()).optional().describe("Router IDs to route alerts to by default. Use list_routers to find IDs."),
      account_user_ids: z.array(z.string()).optional().describe("Account user IDs to route alerts to by default. Use list_account_users to find IDs."),
      options: z.record(z.string(), z.unknown()).optional().describe("Additional option_ prefixed fields specific to this integration type. Fetch the meta.documentation_url from get_integration_type to see available options. Pass them as a flat object e.g. { option_send_resolved: true }"),
    },
    async ({ name, urgency, integration_type_id, enabled, team_ids, router_ids, account_user_ids, options }) => {
      const result = await pagertree.createIntegration({
        name,
        urgency,
        integration_type_id,
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