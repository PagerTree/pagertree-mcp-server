import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetMaintenanceWindow(server: McpServer) {
  server.tool(
    "get_maintenance_window",
    `Get a single maintenance window by ID. Includes name, start/end times, timezone, description, and affected integrations.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Check the \`integration_ids\` field to see which integrations are suppressed during this window

Related: \`list_maintenance_windows\` to find IDs, \`update_maintenance_window\` to modify, \`delete_maintenance_window\` to remove.`,
    {
      id: z.string().describe("Maintenance window ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getMaintenanceWindow(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
