import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateEvent(server: McpServer) {
  server.tool(
    "create_event",
    `Create a new on-call event and add it to a schedule.

There are 3 event types:
- Regular: set start_datetime and end_datetime only
- Repeating: set repeat: true, frequency, and frequency_unit (hourly|daily|weekly|monthly|yearly)
- Rotating: set repeat: true, rotation: true - attendees rotate each occurrence

Required: start_time, end_time, layer, time_zone, at least 1 account_user_id, at least 1 schedule_id

time format: "YYYY-MM-DD HH:MM:SS" e.g. "2024-01-15 08:00:00"
For all-day events use: start_time "YYYY-MM-DD 00:00:00" and end_time "YYYY-MM-DD 00:00:00" where end_time is the NEXT day e.g. start "2024-01-15 00:00:00" end "2024-01-16 00:00:00"

days_of_week: array of integers where 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
Only applicable when frequency_unit is "daily" - use to restrict event to specific days e.g. [1,2,3,4,5] for weekdays only

Tips:
- Always call \`list_event_time_zones\` first to get a valid time_zone value
- Always call \`list_account_users\` to get account_user_ids
- Always call \`list_schedules\` or \`get_team\` to get schedule_ids
- layer must match a layer defined in the team's escalation policy - use \`get_escalation_policy\` to check
- For repeating events, if repeat_end_datetime is omitted the event repeats indefinitely
- repeat_end_datetime is inclusive - if set to Oct 31 the last occurrence will be Oct 31 → Nov 1

Errors:
- 422 if start_time or end_time is missing
- 422 if layer is missing
- 422 if time_zone is invalid - use \`list_event_time_zones\` to get valid values
- 422 if no account_user_ids provided
- 422 if repeat is true but frequency or frequency_unit is missing

Related: \`update_event\` to modify all occurrences, \`override_event\` to change a single occurrence, \`terminate_event\` to end a repeating series, \`add_event_exception\` to skip a single occurrence.`,
    {
      start_time: z.string().describe("Start time of the event e.g. 2024-01-01 08:00:00"),
      end_time: z.string().describe("End time of the event e.g. 2024-01-01 17:00:00"),
      layer: z.number().int().min(1).describe("Escalation layer number"),
      time_zone: z.string().describe("Valid PagerTree timezone name e.g. Arizona, UTC, Eastern Time (US & Canada)"),
      account_user_ids: z.array(z.string()).describe("Account user IDs attending this event"),
      schedule_ids: z.array(z.string()).optional().describe("Schedule IDs this event belongs to"),
      repeat: z.boolean().optional().describe("Whether this is a repeating event"),
      frequency: z.number().int().optional().describe("How often the event repeats (required if repeat is true)"),
      frequency_unit: z.enum(["hourly", "daily", "weekly", "monthly", "yearly"]).optional().describe("Unit of the frequency (required if repeat is true)"),
      days_of_week: z.array(z.number().int().min(0).max(6)).optional().describe("Days of week (0=Sunday, 1=Monday, ..., 6=Saturday)"),
      repeat_end_datetime: z.string().optional().describe("When the repeating event stops"),
      rotation: z.boolean().optional().describe("Whether this is a rotating event"),
    },
    async ({ start_time, end_time, layer, time_zone, account_user_ids, schedule_ids, repeat, frequency, frequency_unit, days_of_week, repeat_end_datetime, rotation }) => {
      const result = await pagertree.createEvent({
        start_time,
        end_time,
        layer,
        time_zone,
        account_user_ids,
        schedule_ids,
        repeat,
        frequency,
        frequency_unit,
        days_of_week,
        repeat_end_datetime,
        rotation,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}