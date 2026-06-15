import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateAlertComment(server: McpServer) {
  server.tool(
    "create_alert_comment",
    "Add a comment to an alert. Useful for adding notes, status updates, or communication to an alert's timeline.",
    {
      id: z.string().describe("Alert ID to comment on"),
      body: z.string().describe("Comment text"),
    },
    async ({ id, body }) => {
      const result = await pagertree.createAlertComment(id, body);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
