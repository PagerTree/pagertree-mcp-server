import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetTeam(server: McpServer) {
  server.tool(
    "get_team",
    `Get a single team by ID. Includes members, admins, active schedule_id, active escalation_policy_id, notification settings, and notes.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Always use this tool first when working with a team's schedule or escalation policy - it contains the active schedule_id and escalation_policy_id
- Check \`member_account_user_ids\` and \`admin_account_user_ids\` to see current membership

Workflow for modifying a team's on-call setup:
1. \`get_team\` → find schedule_id and escalation_policy_id
2. \`get_schedule\` / \`get_escalation_policy\` → inspect current configuration
3. \`update_schedule\` / \`update_escalation_policy\` → make changes

Related: \`list_teams\` to find IDs, \`update_team\` to modify, \`get_current_oncall\` to see who is on-call.`,
    {
      id: z.string().describe("Team ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getTeam(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
