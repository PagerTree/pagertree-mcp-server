import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListEscalationPolicies(server: McpServer) {
  server.tool(
    "list_escalation_policies",
    `List all escalation policies. Escalation policies define how alerts move through on-call layers when no one acknowledges.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- Each team has one active escalation policy at a time

Related: \`get_escalation_policy\` to fetch a single record, \`create_escalation_policy\` to create a new one, \`update_team\` to assign a policy to a team.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of escalation policies to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. name"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listEscalationPolicies({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
