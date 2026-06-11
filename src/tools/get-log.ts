import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetLog(server: McpServer) {
  server.tool(
    "get_log",
    "Get a single log by ID",
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