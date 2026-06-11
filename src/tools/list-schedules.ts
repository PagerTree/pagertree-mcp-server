import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListSchedules(server: McpServer) {
  server.tool(
    "list_schedules",
    "List all on-call schedules",
    {},
    async () => {
      const result = await pagertree.listSchedules();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}