import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListRouters(server: McpServer) {
  server.tool(
    "list_routers",
    `List all routers. Routers are YAML configurations that dynamically route and transform alerts based on match conditions - processed after an integration creates an alert but before it is assigned to a team.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- Routers require at least 1 default receiver (team, account user, or another router)
- After creating a router, point integrations to it via \`update_integration\` or \`create_alert\`.

Related: \`get_router\` to fetch a single record, \`create_router\` to create a new one.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of routers to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. name"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listRouters({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
