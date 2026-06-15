import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListBroadcasts(server: McpServer) {
  server.tool(
    "list_broadcasts",
    `List all broadcasts. Broadcasts are used to notify specific teams or account users with an optional response request.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- Default limit is 10, maximum is 100

Related: \`get_broadcast\` to fetch a single record, \`create_broadcast\` to send a new broadcast.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of broadcasts to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by e.g. created_at"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listBroadcasts({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
