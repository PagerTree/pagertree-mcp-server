import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListTeams(server: McpServer) {
  server.tool(
    "list_teams",
    "List all teams",
    {},
    async () => {
      const result = await pagertree.listTeams();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}