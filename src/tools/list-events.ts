import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListEvents(server: McpServer) {
  server.tool(
    "list_events",
    `List all on-call events. Events are the building blocks of on-call schedules - they define who is on-call, when, and for which escalation layer.

There are 3 event types:
- Regular - a single occurrence with a start and end datetime
- Repeating - recurs on a schedule (hourly, daily, weekly, monthly, yearly)
- Rotating - like repeating but rotates through attendees each occurrence

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- This returns raw event definitions, not processed occurrences
- To see who is actually on-call for a time window use \`get_schedule_window_events\` instead
- To see who is on-call right now use \`get_schedule_current_oncall\` or \`get_current_oncall\`

Related: \`get_event\` to fetch a single record, \`create_event\` to create a new event, \`get_schedule_window_events\` to see processed on-call coverage.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of events to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. start_datetime"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listEvents({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}