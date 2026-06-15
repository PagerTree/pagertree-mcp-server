import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteTeam(server: McpServer) {
  server.tool(
    "delete_team",
    "Delete a team permanently.",
    {
      id: z.string().describe("Team ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteTeam(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
