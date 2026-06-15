import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteRouter(server: McpServer) {
  server.tool(
    "delete_router",
    `Permanently delete a router. Cannot be undone.

Important:
- Any integrations pointing to this router will lose their destination - update them first via \`update_integration\`
- Any other routers that reference this router as a receiver will also be affected

Prerequisites:
- \`get_router\` → confirm correct record before deleting
- \`list_integrations\` → check which integrations are pointing to this router

Related: \`update_integration\` to reassign integrations, \`update_router\` to disable instead, \`list_routers\` to find IDs.`,
    {
      id: z.string().describe("Router ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteRouter(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
