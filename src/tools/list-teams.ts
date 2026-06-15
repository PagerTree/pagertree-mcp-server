import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListTeams(server: McpServer) {
  server.tool(
    "list_teams",
    `List all teams. Teams are the primary organizational unit in PagerTree - they group account users together and have an associated schedule and escalation policy for managing on-call and alert routing.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- Each team has one active schedule and one active escalation policy at a time
- When a team is created, PagerTree automatically creates a default schedule and escalation policy

Related: \`get_team\` to fetch a single record including schedule_id and escalation_policy_id, \`create_team\` to create a new team.`,
    {},
    async () => {
      const result = await pagertree.listTeams();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}