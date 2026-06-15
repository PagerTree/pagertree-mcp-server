import { z } from "zod";
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
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of teams to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by. Use id instead of created_at."),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listTeams({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}