import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerResolveAlert(server: McpServer) {
server.tool(
  "resolve_alert",
  `Resolve an alert. Closes the alert and stops further notifications.

State requirement: alert must be in open | dropped | acknowledged state.

Prerequisites:
- \`list_alerts\` or \`get_alert\` → find the ID
- \`get_alert\` → verify status field before resolving

Errors:
- 422 if alert is not in a valid state for resolution

Related: \`acknowledge_alert\` to acknowledge first, \`delete_alert\` to permanently remove.`,
    {
      id: z.string().describe("Alert ID to resolve"),
    },
    async ({ id }) => {
      const result = await pagertree.resolveAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}