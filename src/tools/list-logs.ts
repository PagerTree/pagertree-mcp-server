import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListLogs(server: McpServer) {
  server.tool(
    "list_logs",
    "List logs, optionally filtered by owner. Logs are polymorphic and can be attached to any object (alerts, schedules, etc).",
    {
      owner_id: z.string().optional().describe("Filter logs by owner ID e.g. an alert ID"),
      owner_type: z.string().optional().describe("Filter logs by owner type e.g. Alert, Schedule, Team"),
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