import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteMaintenanceWindow(server: McpServer) {
  server.tool(
    "delete_maintenance_window",
    `Permanently delete a maintenance window. Cannot be undone.

Note: If the window is currently active, deleting it will immediately resume alert creation from the affected integrations.

Prerequisites:
- \`get_maintenance_window\` → confirm correct record and check if currently active before deleting

Related: \`update_maintenance_window\` to modify dates instead of deleting, \`list_maintenance_windows\` to find IDs.`,
    {
      id: z.string().describe("Maintenance window ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteMaintenanceWindow(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
