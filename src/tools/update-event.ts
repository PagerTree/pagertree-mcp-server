import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateEvent(server: McpServer) {
  server.tool(
    "update_event",
    "Update an existing on-call event. Only provide the fields you want to change. Use list_event_time_zones to get valid timezone names.",
    {
      id: z.string().describe("Event ID to update"),
      start_time: z.string().optional().describe("Start time of the event e.g. 2024-01-01 08:00:00"),
      end_time: z.string().optional().describe("End time of the event e.g. 2024-01-01 17:00:00"),
      layer: z.number().int().min(1).optional().describe("Escalation layer number"),
      time_zone: z.string().optional().describe("Valid PagerTree timezone name e.g. Arizona, UTC, Eastern Time (US & Canada)"),
      account_user_ids: z.array(z.string()).optional().describe("Account user IDs attending this event"),
      schedule_ids: z.array(z.string()).optional().describe("Schedule IDs this event belongs to"),
      repeat: z.boolean().optional().describe("Whether this is a repeating event"),
      frequency: z.number().int().optional().describe("How often the event repeats"),
      frequency_unit: z.enum(["hourly", "daily", "weekly", "monthly", "yearly"]).optional().describe("Unit of the frequency"),
      days_of_week: z.array(z.number().int().min(0).max(6)).optional().describe("Days of week (0=Sunday, 1=Monday, ..., 6=Saturday)"),
      repeat_end_datetime: z.string().optional().describe("When the repeating event stops"),
      rotation: z.boolean().optional().describe("Whether this is a rotating event"),
    },
    async ({ id, start_time, end_time, layer, time_zone, account_user_ids, schedule_ids, repeat, frequency, frequency_unit, days_of_week, repeat_end_datetime, rotation }) => {
      const result = await pagertree.updateEvent(id, {
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