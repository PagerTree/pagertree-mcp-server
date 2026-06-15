import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateSchedule(server: McpServer) {
  server.tool(
    "create_schedule",
    `Create a new on-call schedule.

Note: A default schedule is automatically created when a team is created. Only create a standalone schedule if you need multiple schedules for a single team or a schedule not associated with a team.

After creation:
- Use \`create_event\` to add on-call events to the schedule
- Use \`update_team\` with schedule_id to assign this schedule as the team's active schedule

Errors:
- 422 if name is missing

Related: \`update_schedule\` to rename, \`delete_schedule\` to remove, \`flush_schedule\` to clear all events, \`create_event\` to add events.`,
    {
      name: z.string().describe("Name of the schedule"),
    },
    async ({ name }) => {
      const result = await pagertree.createSchedule({ name });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
