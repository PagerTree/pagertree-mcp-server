import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetCurrentOncall(server: McpServer) {
  server.tool(
    "get_current_oncall",
    "Get who is currently on-call for a team. Returns the on-call event attendees for right now, handling repeating events and rotations.",
    {
      team_id: z.string().describe("Team ID to get current on-call for"),
    },
    async ({ team_id }) => {
      const result = await pagertree.getCurrentOncallForTeam(team_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}