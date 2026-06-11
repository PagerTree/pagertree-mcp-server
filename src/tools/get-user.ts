import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetUser(server: McpServer) {
  server.tool(
    "get_user",
    "Get a single user by ID. Includes emails and phone numbers.",
    {
      id: z.string().describe("User ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getUser(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}