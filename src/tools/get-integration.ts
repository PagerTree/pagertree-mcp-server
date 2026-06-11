import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetIntegration(server: McpServer) {
  server.tool(
    "get_integration",
    "Get a single integration by ID. Includes enabled status, urgency, integration type, and routing destinations.",
    {
      id: z.string().describe("Integration ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getIntegration(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}