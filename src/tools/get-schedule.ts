import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetSchedule(server: McpServer) {
  server.tool(
    "get_schedule",
    "Get a single on-call schedule by ID.",
    {
      id: z.string().describe("Schedule ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getSchedule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
