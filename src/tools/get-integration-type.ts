import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetIntegrationType(server: McpServer) {
  server.tool(
    "get_integration_type",
    `Get a single integration type by ID. Includes the name, description, and \`meta.documentation_url\`.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Always check \`meta.documentation_url\` to understand what \`option_\` prefixed fields are available when creating an integration of this type
- Fetch the documentation_url to get the full list of supported options before calling \`create_integration\`

Related: \`list_integration_types\` to find IDs, \`create_integration\` to use this type.`,
    {
      id: z.string().describe("Integration type ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getIntegrationType(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}