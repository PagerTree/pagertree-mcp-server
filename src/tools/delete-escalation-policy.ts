import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerDeleteEscalationPolicy(server: McpServer) {
  server.tool(
    "delete_escalation_policy",
    "Delete an escalation policy permanently.",
    {
      id: z.string().describe("Escalation policy ID to delete"),
    },
    async ({ id }) => {
      const result = await pagertree.deleteEscalationPolicy(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
