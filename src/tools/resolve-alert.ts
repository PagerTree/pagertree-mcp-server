import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerResolveAlert(server: McpServer) {
  server.tool(
    "resolve_alert",
    "Resolve an alert. Alert must be in open, dropped, or acknowledged state.",
    {
      id: z.string().describe("Alert ID to resolve"),
    },
    async ({ id }) => {
      const result = await pagertree.resolveAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}