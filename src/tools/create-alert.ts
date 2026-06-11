import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateAlert(server: McpServer) {
  server.tool(
    "create_alert",
    "Create a new alert. Requires a title, urgency, and at least one destination (team, router, or account user).",
    {
      title: z.string().describe("Title of the alert"),
      urgency: z.enum(["low", "medium", "high", "critical"]).describe("Urgency level of the alert"),
      description: z.string().optional().describe("Description of the alert"),
      destination_team_ids: z.array(z.string()).optional().describe("Team IDs to route the alert to"),
      destination_router_ids: z.array(z.string()).optional().describe("Router IDs to route the alert to"),
      destination_account_user_ids: z.array(z.string()).optional().describe("Account user IDs to route the alert to"),
      tags: z.array(z.string()).optional().describe("Tags to attach to the alert"),
      incident: z.boolean().optional().describe("Flag this alert as an incident"),
      incident_severity: z.enum(["SEV-1", "SEV-2", "SEV-3", "SEV-4", "SEV-5", "SEV-UNKNOWN"]).optional().describe("Incident severity level"),
      incident_message: z.string().optional().describe("Special incident message"),
    },
    async ({ title, urgency, description, destination_team_ids, destination_router_ids, destination_account_user_ids, tags, incident, incident_severity, incident_message }) => {
      const result = await pagertree.createAlert({
        title,
        urgency,
        description,
        destination_team_ids,
        destination_router_ids,
        destination_account_user_ids,
        tags,
        meta: (incident || incident_severity || incident_message) ? {
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