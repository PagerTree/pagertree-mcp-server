import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteTeam(server: McpServer) {
  server.tool(
    "delete_team",
    `Permanently delete a team. Cannot be undone.

Important:
- Deleting a team also deletes its associated schedule and escalation policy
- Any integrations routing to this team will lose their destination - update them first via \`update_integration\`
- Any alerts currently assigned to this team will be unaffected but future alerts will not route here

Prerequisites:
- \`get_team\` → confirm correct record before deleting
- \`list_integrations\` → check which integrations are routing to this team
- \`list_routers\` → check which routers reference this team as a receiver

Related: \`update_integration\` to reassign integrations, \`update_router\` to update router receivers, \`list_teams\` to find IDs.`,
    {
      id: z.string().describe("Team ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteTeam(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
