import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateBroadcast(server: McpServer) {
  server.tool(
    "update_broadcast",
    `Update an existing broadcast. Only title, description, and tag_list can be updated.

Important: A broadcast is sent immediately on creation. Destinations, channels, and response options cannot be changed after sending - create a new broadcast instead.

Prerequisites:
- \`list_broadcasts\` or \`get_broadcast\` → find the ID
- \`get_broadcast\` → check current values before updating

Related: \`get_broadcast\` to read current state, \`delete_broadcast\` to remove, \`create_broadcast\` to send a new one.`,
    {
      id: z.string().describe("Broadcast ID - accepts ULID, tiny_id, or prefix_id"),
      title: z.string().optional().describe("Title of the broadcast"),
      description: z.string().optional().describe("Description or body of the broadcast"),
      tag_list: z.array(z.string()).optional().describe("Tags to attach to the broadcast"),
    },
    async ({ id, title, description, tag_list }) => {
      const result = await pagertree.updateBroadcast(id, {
        title,
        description,
        tag_list,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
