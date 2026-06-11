import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetAlert(server: McpServer) {
  server.tool(
    "get_alert",
    "Get a single alert by ID",
    {
      id: z.string().describe("Alert ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getAlert(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}