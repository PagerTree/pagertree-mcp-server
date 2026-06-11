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
| `acknowledge_alert` | Acknowledge an alert. Alert must be in open, dropped, or suppressed state. | id |
| `add_event_exception` | Add an exception for a repeating event to delete a single occurrence. Use this to skip a specific occurrence without affecting the rest of the series. | id, action_time |
| `create_alert` | Create a new alert. Requires a title, urgency, and at least one destination (team, router, or account user). | title, urgency, description, destination_team_ids, destination_router_ids, destination_account_user_ids, tags, incident, incident_severity, incident_message |
| `create_event` | Create a new on-call event for a schedule. Requires start/end datetime, layer, timezone, and at least one account user. Use list_event_time_zones to get valid timezone names. | start_time, end_time, layer, time_zone, account_user_ids, schedule_ids, repeat, frequency, frequency_unit, days_of_week, repeat_end_datetime, rotation |
| `delete_event` | Delete an on-call event. This permanently removes the event and all its occurrences. | id |
| `disable_integration` | Disable an integration so it stops receiving webhooks and creating alerts. | id |
| `enable_integration` | Enable an integration so it can receive webhooks and create alerts. | id |
| `get_account_user` | Get a single account user by ID. Includes roles, notification rule, and associated user details. | id |
| `get_alert` | Get a single alert by ID | id |
| `get_current_oncall` | Get who is currently on-call for a team. Returns the on-call event attendees for right now, handling repeating events and rotations. | team_id |
| `get_event` | Get a single on-call event by ID. Includes attendees, schedule assignments, and repeat/rotation settings. | id |
| `get_integration` | Get a single integration by ID. Includes enabled status, urgency, integration type, and routing destinations. | id |
| `get_log` | Get a single log by ID | id |
| `get_user` | Get a single user by ID. Includes emails and phone numbers. | id |
| `list_account_users` | List all account users. An account user represents a user associated with this account, including their roles and notification rules. | limit, offset, page, sort, direction |
| `list_alerts` | List alerts with pagination and filtering. Returns data, has_more, and total_count. | status, limit, offset, page, sort, direction |
| `list_event_time_zones` | List all valid timezone names supported by PagerTree. Use these values when creating or updating events. | - |
| `list_events` | List all on-call events. Events represent single, repeating, or rotating on-call occurrences for account users. | limit, offset, page, sort, direction |
| `list_integrations` | List all integrations. Integrations connect PagerTree to 3rd party applications and are responsible for creating alerts. | limit, offset, page, sort, direction |
| `list_logs` | List logs, optionally filtered by owner. Logs are polymorphic and can be attached to any object (alerts, schedules, etc). | owner_id, owner_type, limit, offset, page, sort, direction |
| `list_schedules` | List all on-call schedules | - |
| `list_teams` | List all teams | - |
| `list_users` | List all users. Users represent physical people and include their emails and phone numbers. | limit, offset, page, sort, direction |
| `override_event` | Override an existing on-call event with a new one for a specific occurrence. Handles breaking up the event just like the UI. Use this to temporarily change who is on-call.

Tips:
- For an all-day override use start_time "YYYY-MM-DD 00:00:00" and end_time "YYYY-MM-DD 23:59:59"
 | id, start_time, end_time, layer, time_zone, account_user_ids, action_time |
| `reject_alert` | Reject an alert. The API key user must have an open workflow for this alert. | id |
| `resolve_alert` | Resolve an alert. Alert must be in open, dropped, or acknowledged state. | id |
| `update_event` | Update an existing on-call event. Only provide the fields you want to change. Use list_event_time_zones to get valid timezone names. | id, start_time, end_time, layer, time_zone, account_user_ids, schedule_ids, repeat, frequency, frequency_unit, days_of_week, repeat_end_datetime, rotation |

## License

MIT
