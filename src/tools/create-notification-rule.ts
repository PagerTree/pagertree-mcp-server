import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pagertree } from "../client.js";

export function registerCreateNotificationRule(server: McpServer) {
  server.tool(
    "create_notification_rule",
    `Create a new notification rule. Rules are written in YAML and control how and when users are notified about alerts.

YAML rules format:
---
rules:
  - match:
      always: true
    actions:
    - type: notify
      channels:
      - email
      - sms
      - push
      - voice
      - slack
      - whatsapp
      timeout: 1m
    - type: repeat
      times: 1

Action types:
- notify - notify user on specific channels (push, email, sms, voice, whatsapp, slack), with optional timeout
- repeat - repeat the above notify actions n times (0-3)
- ignore - suppress notifications entirely

Tips:
- After creating, attach the rule to an account user via update_account_user
- Rules are evaluated top-down; first match wins
- If no rules match, default notification channels are used
- timeout uses ms notation: 30s, 1m, 5m, 1h`,
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