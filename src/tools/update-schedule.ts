import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateSchedule(server: McpServer) {
  server.tool(
    "update_schedule",
    `Update an existing schedule. Currently only the name can be updated.

Prerequisites:
- \`list_schedules\` or \`get_schedule\` → find the ID
- \`get_team\` → find the team's current schedule_id

Related: \`get_schedule\` to read current state, \`delete_schedule\` to remove, \`flush_schedule\` to clear all events.`,
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
