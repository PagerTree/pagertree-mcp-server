import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateRouter(server: McpServer) {
  server.tool(
    "create_router",
    `Create a new router. Routers use YAML rules to dynamically route and transform alerts based on match conditions.

Required: name, at least 1 default receiver (default_receiver_team_id, default_receiver_account_user_id, or default_receiver_router_id)
Optional: rules (YAML), enabled

Important:
- Rules are evaluated top-down - first match wins
- If no rules match, the alert goes to the default receiver
- After creating, point integrations to this router via \`update_integration\`
- Bad YAML indentation is the most common mistake - use exactly 2 spaces
- Receivers in rules must use Prefix IDs (e.g. tem_xxxx, acu_xxxx, rtr_xxxx)

Prerequisites:
- \`list_teams\` → find default_receiver_team_id (use prefix_id e.g. tem_xxxx)
- \`list_account_users\` → find default_receiver_account_user_id (use prefix_id e.g. acu_xxxx)
- \`list_routers\` → find default_receiver_router_id (use prefix_id e.g. rtr_xxxx)

YAML Structure:
\`\`\`yaml
---
rules:
  - match:
      <match_condition>
    actions:
    - type: <action_type>
      <action_parameters>
\`\`\`

Match conditions:
- always: true - matches everything
- alert.urgency: "$in": [critical, high, medium, low]
- alert.title: "$regex": "pattern" with "$options": "i" for case insensitive
- $and / $or / $nor - combine multiple conditions
- $timeBetween - match based on time of day
- $day - match based on ISO day of week (1=Monday, 7=Sunday)
- $now - match based on current date

Action types:
- assign - route alert to receiver (team, account user, or router prefix ID), optional delay
- aggregate - deduplicate alerts by fields for a timeout period, route first to receiver
- ignore - suppress the alert (status → suppressed)
- incident - mark as incident with severity (SEV-1 through SEV-5 or SEV-UNKNOWN) and message
- setval - set alert title, description, tags, or urgency (supports handlebars)
- stakeholder - attach stakeholder IDs to the alert

Example #1 - Always aggregate by source, assign to team:
\`\`\`yaml
---
rules:
- match:
    always: true
  actions:
  - type: aggregate
    by:
    - alert.source_id
    timeout: 1h
    receiver: tem_xxxxxx1
\`\`\`

Example #2 - Critical system down, attach stakeholder, assign with delay:
\`\`\`yaml
---
rules:
- match:
    alert.title:
      "$regex": "Critical Systems Down"
      "$options": "i"
    alert.urgency:
      "$in":
      - high
      - critical
  actions:
  - type: stakeholder
    ids:
    - stk_xxxxx1
  - type: assign
    receiver: tem_xxxxxx1
    delay: 5m
\`\`\`

Example #3 - Office hours routing:
\`\`\`yaml
---
rules:
- match:
    $and:
    - $timeBetween:
        timezone: "America/Los_Angeles"
        timeformat: "hh:mm a"
        starttime: "08:00 am"
        endtime: "05:00 pm"
    - $day:
        timezone: "America/Los_Angeles"
        $in:
        - 1
        - 2
        - 3
        - 4
        - 5
  actions:
    - type: assign
      receiver: tem_xxxxxx1
- match:
    always: true
  actions:
    - type: ignore
\`\`\`

Errors:
- 422 if no default receiver provided

Related: \`update_router\` to modify, \`delete_router\` to remove, \`update_integration\` to point integrations to this router.`,
    {
      name: z.string().describe("Name of the router"),
      default_receiver_team_id: z.string().optional().describe("Team ID to receive alerts when no rules match"),
      default_receiver_account_user_id: z.string().optional().describe("Account user ID to receive alerts when no rules match"),
      default_receiver_router_id: z.string().optional().describe("Router ID to receive alerts when no rules match"),
      enabled: z.boolean().optional().default(true).describe("Whether the router is enabled"),
      rules: z.string().optional().describe("YAML rules definition for routing logic"),
    },
    async ({ name, default_receiver_team_id, default_receiver_account_user_id, default_receiver_router_id, enabled, rules }) => {
      const result = await pagertree.createRouter({
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
