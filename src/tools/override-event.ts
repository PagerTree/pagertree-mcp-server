import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerOverrideEvent(server: McpServer) {
  server.tool(
    "override_event",
    `Override an existing on-call event with a new one for a specific occurrence. Handles breaking up the event just like the UI. Use this to temporarily change who is on-call.

Tips:
- For an all-day override use start_time "YYYY-MM-DD 00:00:00" and end_time "YYYY-MM-DD 23:59:59"
`,
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