import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerAddEventException(server: McpServer) {
  server.tool(
    "add_event_exception",
    `Skip a single occurrence of a repeating event without affecting the rest of the series. The occurrence is removed from the schedule but all other occurrences remain.

Use this when someone is unavailable for one shift in a repeating rotation.

action_time format: iso8601 e.g. "2024-01-15T00:00:00.000-07:00"
action_time is the start datetime of the occurrence to skip.

Workflow:
1. \`get_schedule_window_events\` → find the occurrence and its action_time
2. \`get_event\` → confirm the event ID
3. \`add_event_exception\` → skip that occurrence

Tips:
- Only works on repeating events (repeat: true)
- To replace the occurrence with a different user use \`override_event\` instead
- To end the series from this occurrence onward use \`terminate_event\` instead
- action_time must exactly match the start datetime of the occurrence

Errors:
- 422 if action_time does not match an occurrence of the event
- 422 if event is not a repeating event

Related: \`override_event\` to replace with different attendees, \`terminate_event\` to end series from this point, \`update_event\` to modify all occurrences.`,
    {
      id: z.string().describe("Event ID to add an exception to"),
      action_time: z.string().describe("The start time of the occurrence to skip in iso8601 format e.g. 2022-11-01T00:00:00.000-07:00"),
    },
    async ({ id, action_time }) => {
      const result = await pagertree.addEventException(id, { action_time });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}