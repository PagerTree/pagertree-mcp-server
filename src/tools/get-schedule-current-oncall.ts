import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetScheduleCurrentOncall(server: McpServer) {
  server.tool(
    "get_schedule_current_oncall",
    "Get who is currently on-call for a schedule. Returns the on-call event attendees for right now, handling repeating events and rotations.",
    {
      id: z.string().describe("Schedule ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getScheduleCurrentOncall(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
