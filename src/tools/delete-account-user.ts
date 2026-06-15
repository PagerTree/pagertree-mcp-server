import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteAccountUser(server: McpServer) {
  server.tool(
    "delete_account_user",
    "Remove an account user from this account permanently. This does not delete the underlying user from PagerTree.",
    {
      id: z.string().describe("Account user ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteAccountUser(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}