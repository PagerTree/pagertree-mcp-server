import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateSchedule(server: McpServer) {
  server.tool(
    "update_schedule",
    "Update an existing on-call schedule.",
    {
      id: z.string().describe("Schedule ID to update"),
      name: z.string().describe("New name for the schedule"),
    },
    async ({ id, name }) => {
      const result = await pagertree.updateSchedule(id, { name });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
