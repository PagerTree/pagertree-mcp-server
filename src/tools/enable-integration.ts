import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerEnableIntegration(server: McpServer) {
  server.tool(
    "enable_integration",
    "Enable an integration so it can receive webhooks and create alerts.",
    {
      id: z.string().describe("Integration ID to enable"),
    },
    async ({ id }) => {
      const result = await pagertree.enableIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}