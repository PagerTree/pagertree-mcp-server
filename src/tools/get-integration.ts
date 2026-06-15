import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetIntegration(server: McpServer) {
  server.tool(
    "get_integration",
    `Get a single integration by ID. Includes enabled status, urgency, integration type, webhook URL, and routing destinations.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- The webhook URL in the response is what you configure in the 3rd party tool
- Check \`logs\` on the integration page in the UI to troubleshoot incoming requests

Related: \`list_integrations\` to find IDs, \`update_integration\` to modify, \`enable_integration\` / \`disable_integration\` to toggle.`,
    {
      id: z.string().describe("Integration ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}