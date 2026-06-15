import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateMaintenanceWindow(server: McpServer) {
  server.tool(
    "create_maintenance_window",
    `Create a new maintenance window. During the window, incoming requests from the specified integrations will be suppressed and no alerts will be created.

Tips:
- Use list_integrations to find integration IDs
- Use list_event_time_zones to get valid timezone names
- start_datetime and end_datetime format: "YYYY-MM-DD HH:MM:SS"`,
    {
      name: z.string().describe("Name of the maintenance window"),
      start_datetime: z.string().describe("Start datetime e.g. 2024-01-01 02:00:00"),
      end_datetime: z.string().describe("End datetime e.g. 2024-01-01 04:00:00"),
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
