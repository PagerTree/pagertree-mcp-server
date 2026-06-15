import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetScheduleWindowEvents(server: McpServer) {
  server.tool(
    "get_schedule_window_events",
    `Return on-call event attendees for a specified time window. Handles repeating events and rotations. Useful for answering "who is on call next week?" type questions.

Tips:
- start and end are UTC datetime strings e.g. "2024-01-01 07:00:00"
- Use list_schedules to find schedule IDs`,
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
