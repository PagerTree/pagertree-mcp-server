import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetAccountUser(server: McpServer) {
  server.tool(
    "get_account_user",
    "Get a single account user by ID. Includes roles, notification rule, and associated user details.",
    {
      id: z.string().describe("Account user ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getAccountUser(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}