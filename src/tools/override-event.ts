import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerOverrideEvent(server: McpServer) {
  server.tool(
    "override_event",
    `Override a single occurrence of an on-call event with different attendees and/or times. Handles breaking up the event just like the UI - the original event is split around the override.

Use this when you need to temporarily swap who is on-call for one occurrence without affecting the rest of the series.

Required: id, start_time, end_time, layer, time_zone, account_user_ids, action_time

start_time / end_time format: "YYYY-MM-DD HH:mm:ss" e.g. "2024-01-15 08:00:00"
For all-day override: start_time "YYYY-MM-DD 00:00" and end_time "YYYY-MM-DD 00:00" where end_time is the NEXT day e.g. start "2024-01-15 00:00" end "2024-01-16 00:00"
action_time format: iso8601 e.g. "2024-01-15T00:00:00.000-07:00"

action_time is the start datetime of the specific occurrence you want to override.

Workflow:
1. \`get_schedule_current_oncall\` or \`get_schedule_window_events\` → find the occurrence and its action_time
2. \`get_event\` → get the event ID, layer, and time_zone
3. \`list_account_users\` → find the account_user_ids for the replacement user
4. \`list_event_time_zones\` → confirm valid time_zone value
5. \`override_event\` → create the override

Tips:
- action_time must exactly match the start datetime of the occurrence in iso8601 format
- The override inherits the layer from the original event unless you specify a different one
- For a single (non-repeating) event, use \`update_event\` instead

Errors:
- 422 if action_time does not match an occurrence of the event
- 422 if time_zone is invalid

Related: \`terminate_event\` to end series from a date, \`add_event_exception\` to skip one occurrence, \`update_event\` to modify all occurrences.`,
    {
      id: z.string().describe("Event ID to override"),
      start_time: z.string().describe("Start time for the override in format YYYY-MM-DD HH:mm:ss"),
      end_time: z.string().describe("End time for the override in format YYYY-MM-DD HH:mm:ss"),
      layer: z.number().int().min(1).describe("Layer of the override"),
      time_zone: z.string().describe("Valid PagerTree timezone name e.g. Arizona, UTC, Eastern Time (US & Canada)"),
      account_user_ids: z.array(z.string()).describe("Account user IDs that will attend the override"),
      action_time: z.string().describe("The start time of the occurrence to override in iso8601 format e.g. 2022-11-01T00:00:00.000-07:00"),
    },
    async ({ id, start_time, end_time, layer, time_zone, account_user_ids, action_time }) => {
      const result = await pagertree.overrideEvent(id, {
        start_time,
        end_time,
        layer,
        time_zone,
        account_user_ids,
        action_time,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}