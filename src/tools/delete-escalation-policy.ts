import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteEscalationPolicy(server: McpServer) {
  server.tool(
    "delete_escalation_policy",
    `Permanently delete an escalation policy. Cannot be undone.

Note: Do not delete a policy that is actively assigned to a team - reassign the team to a different policy first via \`update_team\`.

Prerequisites:
- \`get_escalation_policy\` → confirm correct record before deleting
- \`list_teams\` → verify no teams are using this policy before deleting

Related: \`update_team\` to reassign a team to a different policy, \`list_escalation_policies\` to find IDs.`,
    {
      id: z.string().describe("Escalation policy ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteEscalationPolicy(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
