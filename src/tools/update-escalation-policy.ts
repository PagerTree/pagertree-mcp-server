import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateEscalationPolicy(server: McpServer) {
  server.tool(
    "update_escalation_policy",
    `Update an existing escalation policy. Only send fields you want to change - omitted fields are left as-is.

Tips:
- To update an existing layer, include its id
- To add a new layer, include it without an id
- To remove a layer, include its id with \`_destroy: true\`
- timeout_unit: minutes | hours

Prerequisites:
- \`list_escalation_policies\` or \`get_escalation_policy\` → find the ID
- \`get_escalation_policy\` → check current layers and values before updating

Errors:
- 422 if removing all layers leaves the policy in an invalid state

Related: \`get_escalation_policy\` to read current state, \`delete_escalation_policy\` to remove.`,
    {
      id: z.string().describe("Escalation policy ID to update"),
      name: z.string().optional().describe("Name of the escalation policy"),
      repeat: z.number().int().min(0).optional().describe("Number of times to repeat the escalation cycle"),
      reassign_team_ids: z.array(z.string()).optional().describe("Team IDs to reassign to after escalation exhausted"),
      reassign_account_user_ids: z.array(z.string()).optional().describe("Account user IDs to reassign to after escalation exhausted"),
      escalation_layers_attributes: z.array(z.object({
        id: z.string().optional().describe("Existing layer ID (required to update an existing layer)"),
        layer: z.number().int().gte(1).optional().describe("Layer number"),
        timeout: z.number().int().gte(1).optional().describe("Timeout value"),
        timeout_unit: z.enum(["second", "minute", "hour", "day", "week", "month", "year"]).optional().describe("Unit of timeout: seconds, minutes, hours, days, weeks, months, or years"),
        color_hex: z.string().optional().describe("Color hex e.g. #FF0000"),
        _destroy: z.boolean().optional().describe("Set to true to delete this layer"),
      })).optional().describe("Escalation layers to update"),
    },
    async ({ id, name, repeat, reassign_team_ids, reassign_account_user_ids, escalation_layers_attributes }) => {
      const result = await pagertree.updateEscalationPolicy(id, {
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
