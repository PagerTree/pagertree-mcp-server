import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateSchedule(server: McpServer) {
  server.tool(
    "create_schedule",
    "Create a new on-call schedule. A default schedule and escalation policy are created automatically when a team is created, but you can create additional schedules manually.",
    {
      name: z.string().describe("Name of the schedule"),
    },
    async ({ name }) => {
      const result = await pagertree.createSchedule({ name });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
