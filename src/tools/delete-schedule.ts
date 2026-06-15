import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteSchedule(server: McpServer) {
  server.tool(
    "delete_schedule",
    "Delete an on-call schedule permanently.",
    {
      id: z.string().describe("Schedule ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteSchedule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
