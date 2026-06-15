import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteMaintenanceWindow(server: McpServer) {
  server.tool(
    "delete_maintenance_window",
    "Delete a maintenance window permanently.",
    {
      id: z.string().describe("Maintenance window ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteMaintenanceWindow(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
