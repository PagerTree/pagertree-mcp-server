import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListEventTimeZones(server: McpServer) {
  server.tool(
    "list_event_time_zones",
    "List all valid timezone names supported by PagerTree. Use these values when creating or updating events.",
    {},
    async () => {
      const result = await pagertree.listEventTimeZones();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}