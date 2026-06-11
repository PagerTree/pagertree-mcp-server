import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateEvent(server: McpServer) {
  server.tool(
    "create_event",
    "Create a new on-call event for a schedule. Requires start/end datetime, layer, timezone, and at least one account user. Use list_event_time_zones to get valid timezone names.",
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