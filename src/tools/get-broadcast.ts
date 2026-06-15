import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetBroadcast(server: McpServer) {
  server.tool(
    "get_broadcast",
    `Get a single broadcast by ID. Includes status, response options, response counts, and destinations.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Check response counts to see how many recipients have responded

Related: \`list_broadcasts\` to find IDs, \`list_broadcast_comments\` to see comments, \`update_broadcast\` to modify.`,
    {
      id: z.string().describe("Broadcast ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getBroadcast(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
