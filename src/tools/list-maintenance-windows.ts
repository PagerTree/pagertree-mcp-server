import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListMaintenanceWindows(server: McpServer) {
  server.tool(
    "list_maintenance_windows",
    `List all maintenance windows. Maintenance windows suppress alerts from specified integrations during a defined time period - useful for planned outages or deployments.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- Check \`start_datetime\` and \`end_datetime\` to see active vs upcoming vs past windows

Related: \`get_maintenance_window\` to fetch a single record, \`create_maintenance_window\` to schedule a new window.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of maintenance windows to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. start_datetime"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listMaintenanceWindows({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
