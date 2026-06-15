import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateNotificationRule(server: McpServer) {
  server.tool(
    "create_notification_rule",
    `Create a new notification rule. Notification rules are YAML configurations that define custom notification sequences for account users when an alert is opened.

Important:
- Notification rules only apply to Alert open messages - NOT broadcasts
- Rules are evaluated top-down - first match wins
- If no rules match, the user is notified on their default notification channels
- After creating, attach to an account user via \`update_account_user\` with notification_rule_id
- Bad YAML indentation is the most common mistake - use exactly 2 spaces for indentation

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
- $timeBetween: match based on time of day (great for working hours rules)

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

Errors:
- Rule will silently not apply if not attached to an account user

Related: \`update_notification_rule\` to modify, \`delete_notification_rule\` to remove, \`list_notification_rules\` to find existing rules, \`update_account_user\` to attach to a user.`,
    {
      name: z.string().describe("Name of the notification rule"),
      enabled: z.boolean().optional().default(true).describe("Whether the notification rule is enabled"),
      rules: z.string().optional().describe("YAML definition of the notification rules"),
    },
    async ({ name, enabled, rules }) => {
      const result = await pagertree.createNotificationRule({ name, enabled, rules });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}