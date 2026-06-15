import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListAlerts(server: McpServer) {
server.tool(
  "list_alerts",
  `List alerts. Returns paginated data, has_more, and total_count.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Use \`status\` to filter: open, acknowledged, resolved, dropped
- Default limit is 10, maximum is 100

Related: \`get_alert\` to fetch a single alert by ID, \`create_alert\` to create a new alert.`,
    {
      status: z.enum(["open", "acknowledged", "resolved", "dropped"]).optional().describe("Filter by alert status"),
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of alerts to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number (uses limit to calculate offset)"),
      sort: z.string().optional().describe("Attribute to sort by e.g. id"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ status, limit, offset, page, sort, direction }) => {
      const result = await pagertree.listAlerts({ status, limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}