import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerFlushSchedule(server: McpServer) {
  server.tool(
    "flush_schedule",
    "Remove all events from a schedule. This is a destructive action that cannot be undone. Use with caution.",
    {
      id: z.string().describe("Schedule ID to flush"),
    },
    async ({ id }) => {
      const result = await pagertree.flushSchedule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
