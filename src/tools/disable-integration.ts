import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDisableIntegration(server: McpServer) {
  server.tool(
    "disable_integration",
    "Disable an integration so it stops receiving webhooks and creating alerts.",
    {
      id: z.string().describe("Integration ID to disable"),
    },
    async ({ id }) => {
      const result = await pagertree.disableIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}