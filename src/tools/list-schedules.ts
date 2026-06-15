import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListSchedules(server: McpServer) {
  server.tool(
    "list_schedules",
    `List all on-call schedules. Schedules are composed of calendar events that define who is on-call, when, and for which escalation layer.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- A default schedule is automatically created when a team is created - use \`get_team\` to find the team's schedule_id
- Each schedule event is associated with exactly one escalation layer

Related: \`get_schedule\` to fetch a single record, \`get_schedule_current_oncall\` to see who is on-call now, \`get_schedule_window_events\` to see on-call coverage for a time window.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of schedules to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by. Use id instead of created_at."),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listSchedules({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}