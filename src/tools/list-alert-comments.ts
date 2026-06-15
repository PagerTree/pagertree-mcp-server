import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListAlertComments(server: McpServer) {
  server.tool(
    "list_alert_comments",
    "List all comments on an alert.",
    {
      id: z.string().describe("Alert ID"),
    },
    async ({ id }) => {
      const result = await pagertree.listAlertComments(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
