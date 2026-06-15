import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListSchedules(server: McpServer) {
  server.tool(
    "list_schedules",
    `List all on-call schedules. Schedules are composed of calendar events that define who is on-call, when, and for which escalation layer.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- A default schedule is automatically created when a team is created - use \`get_team\` to find the team's schedule_id
- Each schedule event is associated with exactly one escalation layer

Related: \`get_schedule\` to fetch a single record, \`get_schedule_current_oncall\` to see who is on-call now, \`get_schedule_window_events\` to see on-call coverage for a time window.`,
    {},
    async () => {
      const result = await pagertree.listSchedules();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}