# PagerTree MCP Server

MCP server for [PagerTree](https://pagertree.com) - incident management and on-call alerting.

## Installation

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pagertree": {
      "command": "npx",
      "args": ["-y", "pagertree-mcp-server"],
      "env": {
        "PAGERTREE_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Docker

```json
{
  "mcpServers": {
    "pagertree": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "PAGERTREE_API_TOKEN=your-api-token-here",
        "ghcr.io/pagertree/pagertree-mcp-server:latest"
      ]
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PAGERTREE_API_TOKEN` | Yes | Your PagerTree API token |
| `PAGERTREE_API_URL` | No | Override API base URL (default: https://api.pagertree.com/api/v4) |

## Available Tools

| Tool | Description | Parameters |
| --- | --- | --- |
| `get_account_user` | Get a single account user by ID. Includes roles, notification rule, and associated user details. | id |
| `get_alert` | Get a single alert by ID | id |
| `get_broadcast` | Get a single broadcast by ID. Includes status, response options, and response counts. | id |
| `get_current_oncall` | Get who is currently on-call for a team. Returns the on-call event attendees for right now, handling repeating events and rotations. | team_id |
| `get_escalation_policy` | Get a single escalation policy by ID. Includes escalation layers, repeat settings, and reassignment targets. | id |
| `get_event` | Get a single on-call event by ID. Includes attendees, schedule assignments, and repeat/rotation settings. | id |
| `get_integration` | Get a single integration by ID. Includes enabled status, urgency, integration type, and routing destinations. | id |
| `get_integration_type` | Get a single integration type by ID. Includes the integration type name, description, and available options. | id |
| `get_log` | Get a single log by ID | id |
| `get_maintenance_window` | Get a single maintenance window by ID. Includes start/end times, timezone, and affected integrations. | id |
| `get_notification_rule` | Get a single notification rule by ID. Returns the name, enabled status, and YAML rules definition. | id |
| `get_router` | Get a single router by ID. Includes YAML rules and default receiver configuration. | id |
| `get_schedule` | Get a single on-call schedule by ID. | id |
| `get_schedule_current_oncall` | Get who is currently on-call for a schedule. Returns the on-call event attendees for right now, handling repeating events and rotations. | id |
| `get_schedule_events` | Return raw events assigned to a schedule. Does not process repeating events or rotations - returns the unprocessed event definitions. Use get_schedule_window_events for processed on-call coverage. | id |
| `get_schedule_window_events` | Return on-call event attendees for a specified time window. Handles repeating events and rotations. Useful for answering "who is on call next week?" type questions.

Tips:
- start and end are UTC datetime strings e.g. "2024-01-01 07:00:00"
- Use list_schedules to find schedule IDs | id, start, end |
| `get_team` | Get a single team by ID. Includes members, admins, schedule, and escalation policy. | id |
| `get_user` | Get a single user by ID. Includes emails and phone numbers. | id |
| `list_account_users` | List all account users. An account user represents a user associated with this account, including their roles and notification rules. | limit, offset, page, sort, direction |
| `list_alert_comments` | List all comments on an alert. | id |
| `list_alerts` | List alerts with pagination and filtering. Returns data, has_more, and total_count. | status, limit, offset, page, sort, direction |
| `list_broadcast_comments` | List all comments on a broadcast. | id |
| `list_broadcasts` | List all broadcasts. Broadcasts are used to notify specific account users and teams with an optional response request. | limit, offset, page, sort, direction |
| `list_escalation_policies` | List all escalation policies. Escalation policies define how an alert moves through a team's on-call schedule. | limit, offset, page, sort, direction |
| `list_event_time_zones` | List all valid timezone names supported by PagerTree. Use these values when creating or updating events. | - |
| `list_events` | List all on-call events. Events represent single, repeating, or rotating on-call occurrences for account users. | limit, offset, page, sort, direction |
| `list_integration_types` | List all available integration types. Use this to find the integration_type_id needed when creating a new integration. | limit, offset, page, sort, direction |
| `list_integrations` | List all integrations. Integrations connect PagerTree to 3rd party applications and are responsible for creating alerts. | limit, offset, page, sort, direction |
| `list_logs` | List logs, optionally filtered by owner. Logs are polymorphic and can be attached to any object (alerts, schedules, etc). | owner_id, owner_type, limit, offset, page, sort, direction |
| `list_maintenance_windows` | List all maintenance windows. Maintenance windows suppress alerts from integrations during a specified time frame. | limit, offset, page, sort, direction |
| `list_notification_rules` | List all notification rules. Notification rules are YAML configurations that dictate how PagerTree notifies account users about alerts. | limit, offset, page, sort, direction |
| `list_routers` | List all routers. Routers are YAML configurations that dictate how to route and transform alerts. | limit, offset, page, sort, direction |
| `list_schedules` | List all on-call schedules | - |
| `list_team_alerts` | List alerts that have been assigned to a specific team. | id, limit, offset, page, sort, direction |
| `list_teams` | List all teams | - |
| `list_users` | List all users. Users represent physical people and include their emails and phone numbers. | limit, offset, page, sort, direction |

## License

MIT
