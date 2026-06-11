import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerAddEventException(server: McpServer) {
  server.tool(
    "add_event_exception",
    "Add an exception for a repeating event to delete a single occurrence. Use this to skip a specific occurrence without affecting the rest of the series.",
    {
      id: z.string().describe("Event ID to add an exception to"),
      action_time: z.string().describe("The start time of the occurrence to skip in iso8601 format e.g. 2022-11-01T00:00:00.000-07:00"),
    },
    async ({ id, action_time }) => {
      const result = await pagertree.addEventException(id, { action_time });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}