import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetBroadcast(server: McpServer) {
  server.tool(
    "get_broadcast",
    "Get a single broadcast by ID. Includes status, response options, and response counts.",
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
