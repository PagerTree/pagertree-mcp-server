import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateEscalationPolicy(server: McpServer) {
  server.tool(
    "update_escalation_policy",
    "Update an existing escalation policy. To delete a layer, include its id with _destroy: true in escalation_layers_attributes.",
    {
      id: z.string().describe("Escalation policy ID to update"),
      name: z.string().optional().describe("Name of the escalation policy"),
      repeat: z.number().int().min(0).optional().describe("Number of times to repeat the escalation cycle"),
      reassign_team_ids: z.array(z.string()).optional().describe("Team IDs to reassign to after escalation exhausted"),
      reassign_account_user_ids: z.array(z.string()).optional().describe("Account user IDs to reassign to after escalation exhausted"),
      escalation_layers_attributes: z.array(z.object({
        id: z.string().optional().describe("Existing layer ID (required to update an existing layer)"),
        layer: z.number().int().optional().describe("Layer number"),
        timeout: z.number().int().optional().describe("Timeout value"),
        timeout_unit: z.string().optional().describe("Unit of timeout: minutes or hours"),
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
