import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListAlerts(server: McpServer) {
  server.tool(
    "list_alerts",
    "List alerts with pagination and filtering. Returns data, has_more, and total_count.",
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