import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateAlert(server: McpServer) {
server.tool(
  "update_alert",
  `Update an existing alert. Only send fields you want to change - omitted fields are left as-is.

Prerequisites:
- \`list_alerts\` or \`get_alert\` → find the ID
- \`get_alert\` → check current values before updating

Related: \`get_alert\` to read current state, \`delete_alert\` to remove.`,
    {
      id: z.string().describe("Alert ID to update"),
      title: z.string().optional().describe("Title of the alert"),
      description: z.string().optional().describe("Description of the alert"),
      urgency: z.enum(["low", "medium", "high", "critical"]).optional().describe("Urgency level"),
      incident: z.boolean().optional().describe("Flag this alert as an incident"),
      incident_severity: z.enum(["SEV-1", "SEV-2", "SEV-3", "SEV-4", "SEV-5", "SEV-UNKNOWN"]).optional().describe("Incident severity level"),
      incident_message: z.string().optional().describe("Special incident message"),
    },
    async ({ id, title, description, urgency, incident, incident_severity, incident_message }) => {
      const result = await pagertree.updateAlert(id, {
        title,
        description,
        urgency,
        meta: (incident !== undefined || incident_severity || incident_message) ? {
          incident,
          incident_severity,
          incident_message,
        } : undefined,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}