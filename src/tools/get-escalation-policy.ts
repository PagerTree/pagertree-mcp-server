import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerGetEscalationPolicy(server: McpServer) {
  server.tool(
    "get_escalation_policy",
    "Get a single escalation policy by ID. Includes escalation layers, repeat settings, and reassignment targets.",
    {
      id: z.string().describe("Escalation policy ID"),
    },
    async ({ id }) => {
      const result = await pagertree.getEscalationPolicy(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
