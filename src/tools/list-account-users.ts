import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerListAccountUsers(server: McpServer) {
    server.tool(
    "list_account_users",
    `List all account users. An account user represents a person associated with this account, including their roles, notification rules, team memberships, emails, and phones.

Tips:
- Sort by \`id\` asc/desc instead of \`created_at\` - IDs are ULIDs and time-sortable
- This is the primary tool for finding user information - emails and phones are included in the nested \`user\` object
- Default limit is 10, maximum is 100

Related: \`get_account_user\` to fetch a single record by ID, \`create_account_user\` to add a new user to this account.`,
    {
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of account users to return"),
      offset: z.number().int().min(0).optional().describe("Number of records to skip"),
      page: z.number().int().min(1).optional().describe("Page number"),
      sort: z.string().optional().describe("Attribute to sort by"),
      direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
    },
    async ({ limit, offset, page, sort, direction }) => {
      const result = await pagertree.listAccountUsers({ limit, offset, page, sort, direction });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}