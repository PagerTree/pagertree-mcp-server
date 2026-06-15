import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetRouter(server: McpServer) {
  server.tool(
    "get_router",
    `Get a single router by ID. Includes YAML rules, enabled status, and default receiver configuration.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Use this to inspect the YAML rules before modifying

Related: \`list_routers\` to find IDs, \`update_router\` to modify, \`delete_router\` to remove.`,
    {
      id: z.string().describe("Router ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getRouter(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
