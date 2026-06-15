import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateEscalationPolicy(server: McpServer) {
  server.tool(
    "create_escalation_policy",
    `Create a new escalation policy. Escalation policies define how alerts move through on-call layers when no one acknowledges.

Required: name
Optional: escalation_layers_attributes, repeat, reassign_team_ids, reassign_account_user_ids

Tips:
- escalation_layers_attributes defines each layer with a timeout before escalating to the next
- timeout_unit: minutes | hours
- repeat controls how many times to cycle through all layers before reassigning (0 = no repeat)
- reassign_team_ids and reassign_account_user_ids define where to send the alert after all layers exhausted
- A default escalation policy is created automatically when a team is created
- After creation, assign to a team via \`update_team\` with escalation_policy_id

Prerequisites:
- \`list_account_users\` → find reassign_account_user_ids (optional)
- \`list_teams\` → find reassign_team_ids (optional)

Errors:
- 422 if name is missing

Related: \`update_escalation_policy\` to modify, \`delete_escalation_policy\` to remove, \`update_team\` to assign to a team.`,
    {
      name: z.string().describe("Name of the escalation policy"),
      repeat: z.number().int().min(0).optional().describe("Number of times to repeat the escalation cycle"),
      reassign_team_ids: z.array(z.string()).optional().describe("Team IDs to reassign to after escalation exhausted"),
      reassign_account_user_ids: z.array(z.string()).optional().describe("Account user IDs to reassign to after escalation exhausted"),
      escalation_layers_attributes: z.array(z.object({
        layer: z.number().int().gte(1).describe("Layer number (1-based)"),
        timeout: z.number().int().gte(1).describe("Timeout value before escalating to next layer"),
        timeout_unit: z.enum(["second", "minute", "hour", "day", "week", "month", "year"]).describe("Unit of timeout: seconds, minutes, hours, days, weeks, months, or years"),
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
