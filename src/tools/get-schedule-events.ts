import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetScheduleEvents(server: McpServer) {
  server.tool(
    "get_schedule_events",
    "Return raw events assigned to a schedule. Does not process repeating events or rotations - returns the unprocessed event definitions. Use get_schedule_window_events for processed on-call coverage.",
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
