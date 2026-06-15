import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetCurrentOncall(server: McpServer) {
  server.tool(
    "get_current_oncall",
    `Get who is currently on-call for a team. Returns processed on-call event attendees for right now, correctly handling repeating events, rotations, overrides, and exceptions.

Tips:
- Returns account users currently on-call per escalation layer
- If the response is empty, no one is scheduled on-call right now for this team
- For schedule-level on-call (using schedule ID) use \`get_schedule_current_oncall\` instead
- Use the returned event \`id\` and \`action_time\` if you need to override the current on-call shift

Workflow for overriding current on-call:
1. \`list_teams\` → find the team ID
2. \`get_current_oncall\` → find the current event ID and action_time
3. \`list_account_users\` → find the replacement user's account_user_id
4. \`override_event\` → create the override

Prerequisites:
- \`list_teams\` → find the team ID

Related: \`get_schedule_current_oncall\` for schedule-level on-call, \`get_schedule_window_events\` for future coverage, \`override_event\` to swap on-call.`,
    {
      team_id: z.string().describe("Team ID to get current on-call for"),
    },
    async ({ team_id }) => {
      const result = await pagertree.getCurrentOncallForTeam(team_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}