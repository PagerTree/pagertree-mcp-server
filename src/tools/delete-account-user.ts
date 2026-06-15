import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteAccountUser(server: McpServer) {
  server.tool(
    "delete_account_user",
    `Remove a user from this account permanently.

Note: Behavior depends on how many accounts the user belongs to:
- If this is their ONLY account → the user is permanently deleted from PagerTree globally
- If they belong to multiple accounts → they are only removed from this account, their global user record remains intact

Prerequisites:
- \`list_account_users\` or \`get_account_user\` → confirm correct record before deleting

Errors:
- 422 if user is the last admin on the account

Related: \`update_account_user\` to modify roles instead of deleting, \`list_account_users\` to find IDs.`,
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