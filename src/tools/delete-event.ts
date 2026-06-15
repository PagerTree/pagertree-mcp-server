import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteEvent(server: McpServer) {
  server.tool(
    "delete_event",
    `Permanently delete an on-call event and ALL its occurrences. Cannot be undone.

Important:
- For repeating events this deletes the entire series including all past and future occurrences
- To end a series from a specific date onward use \`terminate_event\` instead
- To skip a single occurrence use \`add_event_exception\` instead
- To change a single occurrence use \`override_event\` instead

Prerequisites:
- \`get_event\` → confirm correct record before deleting
- Check \`repeat\` field - if true, consider using \`terminate_event\` instead

Related: \`terminate_event\` to end series from a date, \`add_event_exception\` to skip one occurrence, \`list_events\` to find IDs.`,
    {
      id: z.string().describe("Event ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteEvent(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}