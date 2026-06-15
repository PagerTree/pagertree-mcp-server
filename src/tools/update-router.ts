import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateRouter(server: McpServer) {
  server.tool(
    "update_router",
    "Update an existing router. Only provide the fields you want to change.",
    {
      id: z.string().describe("Router ID to update"),
      name: z.string().optional().describe("Name of the router"),
      enabled: z.boolean().optional().describe("Whether the router is enabled"),
      rules: z.string().optional().describe("YAML rules definition"),
      default_receiver_team_id: z.string().optional().describe("Team ID to receive alerts when no rules match"),
      default_receiver_account_user_id: z.string().optional().describe("Account user ID to receive alerts when no rules match"),
      default_receiver_router_id: z.string().optional().describe("Router ID to receive alerts when no rules match"),
    },
    async ({ id, name, enabled, rules, default_receiver_team_id, default_receiver_account_user_id, default_receiver_router_id }) => {
      const result = await pagertree.updateRouter(id, {
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
