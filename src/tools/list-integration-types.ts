import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListIntegrationTypes(server: McpServer) {
  server.tool(
    "list_integration_types",
    `List all available integration types. Integration types define the 3rd party tools PagerTree can connect to (e.g. Datadog, PagerDuty, email, webhook).

Use this tool to find the integration_type_id needed when creating a new integration.

Tips:
- Default limit is 50 to show most types in one call - increase if needed
- Sort by \`name\` asc for alphabetical listing
- Each integration type includes a \`meta.documentation_url\` - always check this URL for available option_ fields before creating an integration of that type

Related: \`get_integration_type\` for full details including documentation URL, \`create_integration\` to create using a type.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(50).describe("Number of integration types to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. name"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listIntegrationTypes({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}