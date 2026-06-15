import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteIntegration(server: McpServer) {
  server.tool(
    "delete_integration",
    `Permanently delete an integration. Cannot be undone.

Important: Deleting an integration will stop all future alerts from that integration. The webhook URL will stop working immediately. Consider using \`disable_integration\` instead if you may want to re-enable it later.

Prerequisites:
- \`get_integration\` → confirm correct record before deleting

Related: \`disable_integration\` to temporarily stop without deleting, \`list_integrations\` to find IDs.`,
    {
      id: z.string().describe("Integration ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}