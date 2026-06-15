import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateMaintenanceWindow(server: McpServer) {
  server.tool(
    "create_maintenance_window",
    `Create a new maintenance window. During the window, incoming requests from the specified integrations will be suppressed and no alerts will be created.

Required: name, start_datetime, end_datetime, time_zone, at least 1 integration_id

datetime format: "YYYY-MM-DD HH:MM:SS" in UTC e.g. "2024-01-15 02:00:00" - PagerTree will convert to the appropriate timezone for display

Prerequisites:
- \`list_integrations\` → find integration_ids to suppress
- \`list_event_time_zones\` → find a valid time_zone value

Tips:
- Suppression applies only to incoming webhook requests during the window - existing open alerts are not affected
- The window is inclusive of start_datetime and exclusive of end_datetime
- Plan ahead - create the window before the maintenance starts

Errors:
- 422 if no integration_ids provided
- 422 if time_zone is invalid - use \`list_event_time_zones\` to get valid values
- 422 if end_datetime is before start_datetime

Related: \`update_maintenance_window\` to modify, \`delete_maintenance_window\` to remove.`,
    {
      name: z.string().describe("Name of the maintenance window"),
      start_datetime: z.string().describe("Start datetime in UTC e.g. 2024-01-15 02:00:00"),
      end_datetime: z.string().describe("End datetime in UTC e.g. 2024-01-15 04:00:00"),
      time_zone: z.string().describe("Valid PagerTree timezone name e.g. UTC, Eastern Time (US & Canada). Use list_event_time_zones to get valid values."),
      integration_ids: z.array(z.string()).describe("Integration IDs to suppress during this window. Use list_integrations to find IDs."),
      description: z.string().optional().describe("Description of the maintenance window"),
    },
    async ({ name, start_datetime, end_datetime, time_zone, integration_ids, description }) => {
      const result = await pagertree.createMaintenanceWindow({
        name,
        start_datetime,
        end_datetime,
        time_zone,
        integration_ids,
        description,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
