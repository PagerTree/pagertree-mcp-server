import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateEscalationPolicy(server: McpServer) {
  server.tool(
    "create_escalation_policy",
    `Create a new escalation policy. Escalation policies define how alerts move through on-call layers.

Tips:
- escalation_layers_attributes defines each escalation layer with a timeout
- timeout_unit options: minutes, hours
- repeat controls how many times to repeat the full escalation cycle before reassigning
- Use update_team to assign the policy to a team after creation`,
    {
      name: z.string().describe("Name of the escalation policy"),
      repeat: z.number().int().min(0).optional().describe("Number of times to repeat the escalation cycle"),
      reassign_team_ids: z.array(z.string()).optional().describe("Team IDs to reassign to after escalation exhausted"),
      reassign_account_user_ids: z.array(z.string()).optional().describe("Account user IDs to reassign to after escalation exhausted"),
      escalation_layers_attributes: z.array(z.object({
        layer: z.number().int().describe("Layer number (1-based)"),
        timeout: z.number().int().describe("Timeout value before escalating to next layer"),
        timeout_unit: z.string().describe("Unit of timeout: minutes or hours"),
        color_hex: z.string().optional().describe("Color hex for the layer e.g. #FF0000"),
      })).optional().describe("Escalation layers configuration"),
    },
    async ({ name, repeat, reassign_team_ids, reassign_account_user_ids, escalation_layers_attributes }) => {
      const result = await pagertree.createEscalationPolicy({
        name,
        repeat,
        reassign_team_ids,
        reassign_account_user_ids,
        escalation_layers_attributes,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
