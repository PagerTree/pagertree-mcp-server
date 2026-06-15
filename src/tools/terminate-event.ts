import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerTerminateEvent(server: McpServer) {
  server.tool(
    "terminate_event",
    `End a repeating event series from a specific occurrence onward. Deletes the specified occurrence and all future occurrences, leaving past occurrences intact.

Use this when a repeating on-call rotation is ending and you want to stop it from a specific date without affecting the historical record.

action_time format: iso8601 e.g. "2024-01-15T00:00:00.000-07:00"
action_time is the start datetime of the FIRST occurrence you want to delete.

Workflow:
1. \`get_event\` → confirm the event is repeating (repeat: true)
2. \`get_schedule_window_events\` → find the action_time of the first occurrence to terminate
3. \`terminate_event\` → end the series from that occurrence onward

Tips:
- Only works on repeating events (repeat: true) - for single events use \`delete_event\`
- To skip just one occurrence without ending the series use \`add_event_exception\` instead
- Past occurrences are preserved in the historical record

Errors:
- 422 if action_time does not match an occurrence of the event
- 422 if event is not a repeating event

Related: \`add_event_exception\` to skip one occurrence, \`delete_event\` to remove all occurrences, \`update_event\` to modify the series.`,
    {
      id: z.string().describe("Event ID to terminate"),
      action_time: z.string().describe("The start time of the first occurrence to delete in iso8601 format e.g. 2022-11-01T00:00:00.000-07:00"),
    },
    async ({ id, action_time }) => {
      const result = await pagertree.terminateEvent(id, { action_time });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}