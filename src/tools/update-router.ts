import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateRouter(server: McpServer) {
  server.tool(
    "update_router",
    `Update an existing router. Only send fields you want to change - omitted fields are left as-is.

Important:
- Updating \`rules\` replaces the entire YAML definition - always fetch current YAML first via \`get_router\`
- Bad YAML indentation is the most common mistake - use exactly 2 spaces
- Changes take effect immediately for all alerts processed after the update
- Receivers in rules must use Prefix IDs (e.g. tem_xxxx, acu_xxxx, rtr_xxxx)

Example YAML for reference:
\`\`\`yaml
---
rules:
- match:
    always: true
  actions:
  - type: assign
    receiver: tem_xxxxxx1
\`\`\`

Match conditions: always: true, alert.urgency "$in" [...], alert.title "$regex" + "$options", $and/$or/$nor, $timeBetween, $day, $now
Action types: assign (receiver + optional delay), aggregate (by + timeout + receiver), ignore, incident (severity + message), setval (map: title/description/tags/urgency), stakeholder (ids)

Prerequisites:
- \`list_routers\` or \`get_router\` → find the ID
- \`get_router\` → retrieve current YAML before modifying

Errors:
- 422 if YAML is malformed or incorrectly indented
- 422 if no default receiver provided

Related: \`get_router\` to read current YAML, \`create_router\` for full examples, \`delete_router\` to remove.`,
    {
      id: z.string().describe("Router ID to update"),
      name: z.string().optional().describe("Name of the router"),
      enabled: z.boolean().optional().describe("Whether the router is enabled"),
      rules: z.string().optional().describe("YAML rules definition"),
      default_receiver_team_id: z.string().optional().describe("Team ID to receive alerts when no rules match"),
      default_receiver_account_user_id: z.string().optional().describe("Account user ID to receive alerts when no rules match"),
      default_receiver_router_id: z.string().optional().describe("Router ID to receive alerts when no rules match"),
    },
    async ({ id, name, enabled, rules, default_receiver_team_id, default_receiver_account_user_id, default_receiver_router_id }) => {
      const result = await pagertree.updateRouter(id, {
        name,
        enabled,
        rules,
        default_receiver_team_id,
        default_receiver_account_user_id,
        default_receiver_router_id,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
