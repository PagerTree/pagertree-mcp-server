import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetNotificationRule(server: McpServer) {
  server.tool(
    "get_notification_rule",
    "Get a single notification rule by ID. Returns the name, enabled status, and YAML rules definition.",
    {
      id: z.string().describe("Notification rule ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getNotificationRule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}