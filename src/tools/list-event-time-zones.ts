import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListEventTimeZones(server: McpServer) {
  server.tool(
    "list_event_time_zones",
    `List all valid timezone names supported by PagerTree for use in event time_zone fields.

Always call this tool before creating or updating events to ensure the time_zone value is valid.
Using an invalid time_zone will result in a 422 error.

Examples of valid timezone names: "UTC", "Arizona", "Eastern Time (US & Canada)", "Pacific Time (US & Canada)", "London", "Tokyo"

Related: \`create_event\`, \`update_event\`, \`override_event\` all require a valid time_zone value.`,
    {},
    async () => {
      const result = await pagertree.listEventTimeZones();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}