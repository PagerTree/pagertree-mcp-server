import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetIntegrationType(server: McpServer) {
  server.tool(
    "get_integration_type",
    "Get a single integration type by ID. Includes the integration type name, description, and available options.",
    {
      id: z.string().describe("Integration type ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getIntegrationType(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}