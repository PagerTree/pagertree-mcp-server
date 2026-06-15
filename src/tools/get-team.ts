import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetTeam(server: McpServer) {
  server.tool(
    "get_team",
    "Get a single team by ID. Includes members, admins, schedule, and escalation policy.",
    {
      id: z.string().describe("Team ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getTeam(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
