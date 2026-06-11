import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateNotificationRule(server: McpServer) {
  server.tool(
    "update_notification_rule",
    "Update an existing notification rule. Only provide the fields you want to change.",
    {
      id: z.string().describe("Notification rule ID to update"),
      name: z.string().optional().describe("Name of the notification rule"),
      enabled: z.boolean().optional().describe("Whether the notification rule is enabled"),
      rules: z.string().optional().describe("YAML definition of the notification rules"),
    },
    async ({ id, name, enabled, rules }) => {
      const result = await pagertree.updateNotificationRule(id, { name, enabled, rules });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}