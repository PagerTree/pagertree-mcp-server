import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteAlert(server: McpServer) {
  server.tool(
  "delete_alert",
  `Permanently delete an alert. Cannot be undone.

Prerequisites:
- \`get_alert\` → confirm correct record before deleting

Related: \`resolve_alert\` to resolve instead of delete, \`list_alerts\` to find IDs.`,
    {
      id: z.string().describe("Alert ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}