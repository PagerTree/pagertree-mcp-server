import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetScheduleWindowEvents(server: McpServer) {
  server.tool(
    "get_schedule_window_events",
    `Return processed on-call event attendees for a specified time window. Correctly handles repeating events, rotations, overrides, and exceptions. Use this to answer "who is on-call next week?" type questions.

start and end are UTC datetime strings e.g. "2024-01-15 07:00:00"

Tips:
- Returns processed occurrences, not raw event definitions - use \`get_schedule_events\` for raw definitions
- If the response is empty, no one is scheduled on-call for that window
- For overriding a specific occurrence, use the \`action_time\` from the returned events with \`override_event\`

Workflow for finding and overriding an occurrence:
1. \`get_team\` → find schedule_id
2. \`get_schedule_window_events\` → find the occurrence and its action_time
3. \`override_event\` → override with a different attendee

Prerequisites:
- \`list_schedules\` or \`get_team\` → find the schedule ID

Related: \`get_schedule_current_oncall\` for current on-call, \`get_schedule_events\` for raw event definitions, \`override_event\` to change a specific occurrence.`,
    {
      id: z.string().describe("Schedule ID"),
      start: z.string().describe("UTC start datetime e.g. 2024-01-01 07:00:00"),
      end: z.string().describe("UTC end datetime e.g. 2024-01-08 07:00:00"),
    },
    async ({ id, start, end }) => {
      const result = await pagertree.getScheduleWindowEvents(id, { start, end });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
