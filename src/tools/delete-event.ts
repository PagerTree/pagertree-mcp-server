import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteEvent(server: McpServer) {
  server.tool(
    "delete_event",
    "Delete an on-call event. This permanently removes the event and all its occurrences.",
    {
      id: z.string().describe("Event ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteEvent(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}