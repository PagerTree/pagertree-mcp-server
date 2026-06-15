import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerUpdateNotificationRule(server: McpServer) {
  server.tool(
    "update_notification_rule",
    `Update an existing notification rule. Only send fields you want to change - omitted fields are left as-is.

Important:
- Updating \`rules\` replaces the entire YAML definition - always retrieve current YAML first via \`get_notification_rule\`
- Bad YAML indentation is the most common mistake - use exactly 2 spaces
- Changes take effect immediately for all account users attached to this rule

YAML Structure:
\`\`\`yaml
---
rules:
  - match:
      <match_condition>
    actions:
    - type: notify
      channels:
      - push
      - email
      - sms
      - voice
      - slack
      - whatsapp
      timeout: 1m
    - type: repeat
      times: 1
\`\`\`

Action types:
- notify - notify on specified channels then wait timeout before next action
  - channels: push, email, sms, voice, slack, whatsapp
  - channel_options: control which email/phone to use (primary, secondary, or specific value)
  - timeout: ms notation e.g. 30s, 1m, 5m, 1h
- repeat - repeat all above notify actions n times (0-3)
- ignore - suppress all notifications when matched

Match conditions:
- always: true - matches everything
- alert.urgency: "$in": [critical, high, medium, low]
- alert.title: "$regex": "pattern" with "$options": "i" for case insensitive
- $and: combine multiple conditions
- $timeBetween: match based on time of day

Example #1 - Match everything, notify email/sms/slack then voice:
\`\`\`yaml
---
rules:
  - match:
      always: true
    actions:
    - type: notify
      channels:
      - email
      - sms
      - slack
      timeout: 1m
    - type: notify
      channels:
      - voice
      timeout: 5m
    - type: repeat
      times: 1
\`\`\`

Example #2 - Special alerts and working hours:
\`\`\`yaml
---
rules:
  - match:
      alert.title:
        "$regex": "special title"
        "$options": "i"
    actions:
    - type: notify
      channels:
      - email
      - slack
      timeout: 1m
    - type: notify
      channels:
      - voice
      timeout: 5m
    - type: repeat
      times: 1
  - match:
      $and:
        - alert.urgency:
            "$in":
            - low
            - medium
        - $timeBetween:
            timeformat: 'hh:mm a'
            timezone: 'America/Los_Angeles'
            starttime: '05:00 pm'
            endtime: '08:00 am'
    actions:
    - type: ignore
\`\`\`

Example #3 - Primary then secondary phone:
\`\`\`yaml
---
rules:
  - match:
      always: true
    actions:
    - type: notify
      channels:
      - voice
      timeout: 1m
    - type: notify
      channels:
      - voice
      channel_options:
        voice: "secondary"
        voice_fallback: true
      timeout: 5m
\`\`\`

Prerequisites:
- \`list_notification_rules\` or \`get_notification_rule\` → find the ID
- \`get_notification_rule\` → retrieve current YAML before modifying

Related: \`get_notification_rule\` to read current YAML, \`delete_notification_rule\` to remove.`,
    {
      id: z.string().describe("Notification rule ID to update"),
      name: z.string().optional().describe("Name of the notification rule"),
      enabled: z.boolean().optional().describe("Whether the notification rule is enabled"),
      rules: z.string().optional().describe("YAML definition of the notification rules"),
    },
    async ({ id, name, enabled, rules }) => {
      const result = await pagertree.updateNotificationRule(id, { name, enabled, rules });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}