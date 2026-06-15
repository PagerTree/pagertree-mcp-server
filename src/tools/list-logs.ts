import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListLogs(server: McpServer) {
  server.tool(
    "list_logs",
    `List logs, optionally filtered by owner. Logs are polymorphic and can be attached to any object in PagerTree (alerts, integrations, schedules, etc).

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- Filter by owner_id + owner_type to get logs for a specific object
- owner_type values: Alert, Integration, Broadcast

Common workflows:
- Debug an integration: filter by owner_id = integration ID and owner_type = "Integration"
- See alert history: filter by owner_id = alert ID and owner_type = "Alert"

Related: \`get_log\` to fetch a single log by ID.`,
    {
      owner_id: z.string().optional().describe("Filter logs by owner ID e.g. an alert ID"),
      owner_type: z.string().optional().describe("Filter logs by owner type e.g. Alert, Integration, Broadcast"),
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of logs to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. created_at"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ owner_id, owner_type, limit, offset, page, sort, direction }) => {
      const result = await pagertree.listLogs({ owner_id, owner_type, limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}