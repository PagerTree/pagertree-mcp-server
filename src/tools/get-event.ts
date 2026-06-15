import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetEvent(server: McpServer) {
  server.tool(
    "get_event",
    `Get a single on-call event by ID. Returns the raw event definition including attendees, schedule assignments, repeat/rotation settings, and exceptions.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Returns the event definition, not processed occurrences
- Check \`repeat\` and \`rotation\` fields to understand the event type
- Check \`exceptions\` to see which occurrences have been skipped
- Check \`parent_id\` to see if this is an override of another event

Related: \`list_events\` to find IDs, \`update_event\` to modify, \`override_event\` to override a single occurrence.`,
    {
      id: z.string().describe("Event ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getEvent(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}