import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerTerminateEvent(server: McpServer) {
  server.tool(
    "terminate_event",
    "Deletes the occurrence and all future occurrences of a repeating event. Use this to end a repeating event series from a specific date onward. To delete just a single occurrence use add_event_exception instead.",
    {
      id: z.string().describe("Event ID to terminate"),
      action_time: z.string().describe("The start time of the first occurrence to delete in iso8601 format e.g. 2022-11-01T00:00:00.000-07:00"),
    },
    async ({ id, action_time }) => {
      const result = await pagertree.terminateEvent(id, { action_time });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}