import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetEscalationPolicy(server: McpServer) {
  server.tool(
    "get_escalation_policy",
    `Get a single escalation policy by ID. Includes escalation layers, repeat settings, and reassignment targets.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Escalation layers define the timeout before moving to the next layer

Related: \`list_escalation_policies\` to find IDs, \`update_escalation_policy\` to modify, \`update_team\` to assign to a team.`,
    {
      id: z.string().describe("Escalation policy ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getEscalationPolicy(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
