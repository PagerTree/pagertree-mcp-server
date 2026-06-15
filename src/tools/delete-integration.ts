import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteIntegration(server: McpServer) {
  server.tool(
    "delete_integration",
    "Delete an integration permanently.",
    {
      id: z.string().describe("Integration ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}