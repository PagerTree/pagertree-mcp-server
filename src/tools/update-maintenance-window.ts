import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateMaintenanceWindow(server: McpServer) {
  server.tool(
    "update_maintenance_window",
    "Update an existing maintenance window. Only provide the fields you want to change.",
    {
      id: z.string().describe("Maintenance window ID to update"),
      name: z.string().optional().describe("Name of the maintenance window"),
      start_datetime: z.string().optional().describe("Start datetime e.g. 2024-01-01 02:00:00"),
      end_datetime: z.string().optional().describe("End datetime e.g. 2024-01-01 04:00:00"),
      time_zone: z.string().optional().describe("Valid PagerTree timezone name. Use list_event_time_zones to get valid values."),
      integration_ids: z.array(z.string()).optional().describe("Integration IDs to suppress during this window"),
      description: z.string().optional().describe("Description of the maintenance window"),
    },
    async ({ id, name, start_datetime, end_datetime, time_zone, integration_ids, description }) => {
      const result = await pagertree.updateMaintenanceWindow(id, {
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
