import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetLog(server: McpServer) {
  server.tool(
    "get_log",
    `Get a single log by ID. Logs record activity and state changes for objects in PagerTree.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup
- Log body contains the full details of what occurred including request/response data for integrations

Related: \`list_logs\` to find IDs or filter by owner.`,
    {
      id: z.string().describe("Log ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getLog(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}