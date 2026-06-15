import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerEnableIntegration(server: McpServer) {
  server.tool(
    "enable_integration",
    `Enable an integration so it can receive webhook requests and create alerts.

Prerequisites:
- \`list_integrations\` or \`get_integration\` → find the ID
- \`get_integration\` → verify current enabled status

Related: \`disable_integration\` to stop, \`get_integration\` to check current state.`,
    {
      id: z.string().describe("Integration ID to enable"),
    },
    async ({ id }) => {
      const result = await pagertree.enableIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}