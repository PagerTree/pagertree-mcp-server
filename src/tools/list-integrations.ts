import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListIntegrations(server: McpServer) {
  server.tool(
    "list_integrations",
    `List all integrations. Integrations connect PagerTree to 3rd party tools and are responsible for creating alerts.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100
- Check \`enabled\` field to see if an integration is active

Related: \`get_integration\` to fetch a single record, \`create_integration\` to add a new one, \`list_integration_types\` to see available integration types.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of integrations to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. name"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listIntegrations({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}