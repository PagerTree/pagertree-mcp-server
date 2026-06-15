import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetAccountUser(server: McpServer) {
  server.tool(
    "get_account_user",
    `Get a single account user by ID. Includes roles, notification rule, team memberships, and the nested user object with emails and phones.

Tips:
- Accepts ULID, tiny_id, or prefix_id for lookup e.g. \`01KV5YNDYM25RR9JAWMNKZPHH6\`, \`123\`, or \`au_xxxx\`
- This is the primary tool for getting full user details

Related: \`list_account_users\` to find IDs, \`update_account_user\` to modify, \`delete_account_user\` to remove.`,
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