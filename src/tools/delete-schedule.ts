import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteSchedule(server: McpServer) {
  server.tool(
    "delete_schedule",
    `Permanently delete a schedule and all its events. Cannot be undone.

Important:
- All events in the schedule will be permanently deleted
- If this schedule is the active schedule for a team, the team will have no on-call coverage after deletion
- Use \`flush_schedule\` to clear events without deleting the schedule
- Use \`get_team\` to check if this schedule is the active schedule before deleting

Prerequisites:
- \`get_schedule\` → confirm correct record before deleting
- \`get_team\` → verify no team is actively using this schedule

Related: \`flush_schedule\` to clear events only, \`update_team\` to assign a different schedule, \`list_schedules\` to find IDs.`,
    {
      id: z.string().describe("Schedule ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteSchedule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
