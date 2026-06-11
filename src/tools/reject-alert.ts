import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerRejectAlert(server: McpServer) {
  server.tool(
    "reject_alert",
    "Reject an alert. The API key user must have an open workflow for this alert.",
    {
      id: z.string().describe("Alert ID to reject"),
    },
    async ({ id }) => {
      const result = await pagertree.rejectAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}