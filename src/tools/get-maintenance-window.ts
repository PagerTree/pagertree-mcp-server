import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetMaintenanceWindow(server: McpServer) {
  server.tool(
    "get_maintenance_window",
    "Get a single maintenance window by ID. Includes start/end times, timezone, and affected integrations.",
    {
      id: z.string().describe("Maintenance window ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getMaintenanceWindow(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
