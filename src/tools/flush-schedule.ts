import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerFlushSchedule(server: McpServer) {
  server.tool(
    "flush_schedule",
    `Remove all events from a schedule. The schedule itself is preserved but all on-call events are permanently deleted. Cannot be undone.

Use this to clear a schedule and start fresh without deleting the schedule itself.

Important:
- All events are permanently deleted - this cannot be undone
- The team will have no on-call coverage after flushing until new events are created
- Consider using \`get_schedule_events\` to review events before flushing

Prerequisites:
- \`get_schedule\` or \`list_schedules\` → confirm correct schedule before flushing
- \`get_schedule_events\` → review existing events before flushing

Related: \`create_event\` to add new events after flushing, \`delete_schedule\` to delete the schedule entirely.`,
    {
      id: z.string().describe("Schedule ID to flush"),
    },
    async ({ id }) => {
      const result = await pagertree.flushSchedule(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
