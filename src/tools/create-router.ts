import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateRouter(server: McpServer) {
  server.tool(
    "create_router",
    `Create a new router. Routers use YAML rules to route and transform alerts to different destinations.

YAML rules format:
---
rules:
  - match:
      alert.urgency:
        "$in":
          - critical
          - high
    actions:
    - type: route
      destination_type: Team
      destination_id: "team-id-here"

Tips:
- Requires at least 1 default receiver (team, account user, or another router)
- If no rules match, the alert goes to the default receiver
- Use list_teams, list_account_users, or list_routers to find destination IDs`,
    {
      name: z.string().describe("Name of the router"),
      default_receiver_team_id: z.string().optional().describe("Team ID to receive alerts when no rules match"),
      default_receiver_account_user_id: z.string().optional().describe("Account user ID to receive alerts when no rules match"),
      default_receiver_router_id: z.string().optional().describe("Router ID to receive alerts when no rules match"),
      enabled: z.boolean().optional().default(true).describe("Whether the router is enabled"),
      rules: z.string().optional().describe("YAML rules definition for routing logic"),
    },
    async ({ name, default_receiver_team_id, default_receiver_account_user_id, default_receiver_router_id, enabled, rules }) => {
      const result = await pagertree.createRouter({
        name,
        enabled,
        rules,
        default_receiver_team_id,
        default_receiver_account_user_id,
        default_receiver_router_id,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
