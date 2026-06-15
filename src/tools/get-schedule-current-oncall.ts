import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetScheduleCurrentOncall(server: McpServer) {
  server.tool(
    "get_schedule_current_oncall",
    `Get who is currently on-call for a schedule. Returns the processed on-call event attendees for right now, correctly handling repeating events, rotations, overrides, and exceptions.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Returns account users currently on-call per escalation layer
- If the response is empty, no one is scheduled on-call right now
- For team-level on-call (without needing schedule ID) use \`get_current_oncall\` instead

Workflow:
1. \`get_team\` → find the team's schedule_id
2. \`get_schedule_current_oncall\` → see who is on-call now

Related: \`get_current_oncall\` to get on-call by team ID directly, \`get_schedule_window_events\` to see future on-call coverage.`,
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
