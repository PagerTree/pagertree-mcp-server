import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerAcknowledgeAlert(server: McpServer) {
  server.tool(
    "acknowledge_alert",
    "Acknowledge an alert. Alert must be in open, dropped, or suppressed state.",
    {
      id: z.string().describe("Alert ID to acknowledge"),
    },
    async ({ id }) => {
      const result = await pagertree.acknowledgeAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}