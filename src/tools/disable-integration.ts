import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDisableIntegration(server: McpServer) {
  server.tool(
    "disable_integration",
    `Disable an integration so it stops receiving webhook requests and creating alerts. The integration and its webhook URL are preserved and can be re-enabled later.

Use this instead of \`delete_integration\` when you want to temporarily pause an integration.

Prerequisites:
- \`list_integrations\` or \`get_integration\` → find the ID
- \`get_integration\` → verify current enabled status

Related: \`enable_integration\` to re-enable, \`delete_integration\` to permanently remove.`,
    {
      id: z.string().describe("Integration ID to disable"),
    },
    async ({ id }) => {
      const result = await pagertree.disableIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}