import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListTeamAlerts(server: McpServer) {
  server.tool(
    "list_team_alerts",
    "List alerts that have been assigned to a specific team.",
    {
      id: z.string().describe("Team ID"),
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of alerts to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. created_at"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ id, limit, offset, page, sort, direction }) => {
      const result = await pagertree.listTeamAlerts(id, { limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
