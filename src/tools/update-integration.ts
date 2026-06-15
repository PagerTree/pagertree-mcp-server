import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateIntegration(server: McpServer) {
  server.tool(
    "update_integration",
    "Update an existing integration. Only provide the fields you want to change. Use enable_integration or disable_integration to toggle enabled status.",
    {
      id: z.string().describe("Integration ID to update"),
      name: z.string().optional().describe("Name of the integration"),
      urgency: z.enum(["low", "medium", "high", "critical"]).optional().describe("Default urgency for alerts"),
      enabled: z.boolean().optional().describe("Whether the integration is enabled"),
      team_ids: z.array(z.string()).optional().describe("Team IDs to route alerts to by default"),
      router_ids: z.array(z.string()).optional().describe("Router IDs to route alerts to by default"),
      account_user_ids: z.array(z.string()).optional().describe("Account user IDs to route alerts to by default"),
    },
    async ({ id, name, urgency, enabled, team_ids, router_ids, account_user_ids }) => {
      const result = await pagertree.updateIntegration(id, {
        name,
        urgency,
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