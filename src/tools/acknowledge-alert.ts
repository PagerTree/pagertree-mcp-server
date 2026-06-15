import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerAcknowledgeAlert(server: McpServer) {
server.tool(
  "acknowledge_alert",
  `Acknowledge an alert. Indicates someone is aware and working on it.

State requirement: alert must be in open | dropped | suppressed state.

Prerequisites:
- \`list_alerts\` or \`get_alert\` → find the ID
- \`get_alert\` → verify status field before acknowledging

Errors:
- 422 if alert is not in a valid state for acknowledgement

Related: \`resolve_alert\` to close the alert, \`reject_alert\` to reject, \`get_alert\` to check current state.`,
    {
      id: z.string().describe("Alert ID to acknowledge"),
    },
    async ({ id }) => {
      await pagertree.acknowledgeAlert(id);
      // API bug: acknowledge response does not reflect updated state immediately.
      // Fetch the alert after acknowledging to return the correct current state.
      const result = await pagertree.getAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}