import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetScheduleEvents(server: McpServer) {
  server.tool(
    "get_schedule_events",
    `Return raw event definitions assigned to a schedule. Does not process repeating events, rotations, overrides, or exceptions - returns the unprocessed event records as stored.

Use this to:
- See all event definitions for a schedule
- Find event IDs to pass to \`update_event\`, \`delete_event\`, \`override_event\`, etc.
- Audit the raw configuration of a schedule

Tips:
- For processed on-call coverage use \`get_schedule_window_events\` instead
- For who is on-call right now use \`get_schedule_current_oncall\` instead
- Each event includes the full definition including repeat/rotation settings

Related: \`get_schedule_window_events\` for processed coverage, \`get_schedule_current_oncall\` for current on-call, \`create_event\` to add events, \`update_event\` / \`delete_event\` to modify.`,
    {
      id: z.string().describe("Schedule ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getScheduleEvents(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
