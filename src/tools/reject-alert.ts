import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerRejectAlert(server: McpServer) {
  server.tool(
  "reject_alert",
  `Reject an alert. Indicates the user cannot take action on this alert. Actively saying "I won't handle this" / "I can't acknowledge this" instead of just ignoring it.

State requirement: API key user must have an open workflow for this alert and the alert must be in the open state.

Prerequisites:
- \`list_alerts\` or \`get_alert\` → find the ID
- \`get_alert\` → verify status and workflows before rejecting

Errors:
- 422 if the API key user does not have an open workflow for this alert
- 422 if alert is not in a valid state for rejection

Related: \`acknowledge_alert\` to acknowledge instead, \`resolve_alert\` to resolve.`,
    {
      id: z.string().describe("Alert ID to reject"),
    },
    async ({ id }) => {
      const result = await pagertree.rejectAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}