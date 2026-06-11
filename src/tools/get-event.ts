import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetEvent(server: McpServer) {
  server.tool(
    "get_event",
    "Get a single on-call event by ID. Includes attendees, schedule assignments, and repeat/rotation settings.",
    {
      id: z.string().describe("Event ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getEvent(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}