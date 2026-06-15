import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetSchedule(server: McpServer) {
  server.tool(
    "get_schedule",
    `Get a single on-call schedule by ID. Includes name and associated team.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Use \`get_schedule_current_oncall\` to see who is on-call right now for this schedule
- Use \`get_schedule_window_events\` to see processed on-call coverage for a time window
- Use \`get_schedule_events\` to see raw event definitions

Related: \`list_schedules\` to find IDs, \`update_schedule\` to rename, \`get_schedule_current_oncall\` to see current on-call.`,
    {
      id: z.string().describe("Schedule ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getSchedule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
