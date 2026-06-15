import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateIntegration(server: McpServer) {
  server.tool(
    "create_integration",
    `Create a new integration. Integrations connect PagerTree to 3rd party applications and are responsible for creating alerts.

Tips:
- Use list_integration_types to find a valid integration_type_id
- Requires at least 1 destination (team, router, or account user)
- Some integration types support option_ prefixed fields for additional configuration
- After creation, the integration will have a webhook URL you can configure in the 3rd party app`,
    {
      name: z.string().describe("Name of the integration"),
      urgency: z.enum(["low", "medium", "high", "critical"]).describe("Default urgency for alerts created by this integration"),
      integration_type_id: z.string().describe("Integration type ID. Use list_integration_types to find valid IDs."),
      enabled: z.boolean().optional().default(true).describe("Whether the integration is enabled"),
      team_ids: z.array(z.string()).optional().describe("Team IDs to route alerts to by default. Use list_teams to find IDs."),
      router_ids: z.array(z.string()).optional().describe("Router IDs to route alerts to by default. Use list_routers to find IDs."),
      account_user_ids: z.array(z.string()).optional().describe("Account user IDs to route alerts to by default. Use list_account_users to find IDs."),
    },
    async ({ name, urgency, integration_type_id, enabled, team_ids, router_ids, account_user_ids }) => {
      const result = await pagertree.createIntegration({
        name,
        urgency,
        integration_type_id,
        enabled,
        team_ids,
        router_ids,
        account_user_ids,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}