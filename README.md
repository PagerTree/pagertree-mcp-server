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

### Account Users

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_account_users` | List all account users. An account user represents a person associated with this account, including their roles, notification rules, team memberships, emails, and phones. | limit, offset, page, sort, direction |
| `get_account_user` | Get a single account user by ID. Includes roles, notification rule, team memberships, and the nested user object with emails and phones. | id |
| `create_account_user` | Create a new user and associate them with this PagerTree account. | name, email, notification_rule_id, roles, member_team_ids, notify_push, notify_email, notify_sms, notify_voice, phone |
| `update_account_user` | Update an existing account user. Only send fields you want to change - omitted fields are left as-is. | id, notification_rule_id, roles, member_team_ids, name, notify_push, notify_email, notify_sms, notify_voice, emails_attributes, phones_attributes |
| `delete_account_user` | Remove a user from this account permanently. | id |

### Alerts

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_alerts` | List alerts. Returns paginated data, has_more, and total_count. | status, limit, offset, page, sort, direction |
| `get_alert` | Get a single alert by ID. Returns full details including title, description, urgency, status, timestamps, and meta (incident info). | id |
| `create_alert` | Create a new alert. | title, urgency, description, destination_team_ids, destination_router_ids, destination_account_user_ids, tags, incident, incident_severity, incident_message |
| `update_alert` | Update an existing alert. Only send fields you want to change - omitted fields are left as-is. | id, title, description, urgency, incident, incident_severity, incident_message |
| `delete_alert` | Permanently delete an alert. Cannot be undone. | id |
| `acknowledge_alert` | Acknowledge an alert. Indicates someone is aware and working on it. | id |
| `reject_alert` | Reject an alert. Indicates the user cannot take action on this alert. Actively saying "I won't handle this" / "I can't acknowledge this" instead of just ignoring it. | id |
| `resolve_alert` | Resolve an alert. Closes the alert and stops further notifications. | id |
| `list_alert_comments` | List all comments on an alert. | id |
| `create_alert_comment` | Add a comment to an alert. Useful for adding status updates, notes, or communication to the alert timeline. | id, body |

### Broadcasts

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_broadcasts` | List all broadcasts. Broadcasts are used to notify specific teams or account users with an optional response request. | limit, offset, page, sort, direction |
| `get_broadcast` | Get a single broadcast by ID. Includes status, response options, response counts, and destinations. | id |
| `create_broadcast` | Create and send a new broadcast to teams or account users. | title, destination_team_ids, destination_account_user_ids, description, tag_list, response_requested, response_requested_by, broadcast_response_options_attributes, select_specific_channels, notify_push, notify_email, notify_sms, notify_slack, notify_whatsapp |
| `update_broadcast` | Update an existing broadcast. Only title, description, and tag_list can be updated. | id, title, description, tag_list |
| `delete_broadcast` | Permanently delete a broadcast. Cannot be undone. | id |
| `list_broadcast_comments` | List all comments on a broadcast. | id |
| `create_broadcast_comment` | Add a comment to a broadcast. | id, body |

### Escalation Policies

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_escalation_policies` | List all escalation policies. Escalation policies define how alerts move through on-call layers when no one acknowledges. | limit, offset, page, sort, direction |
| `get_escalation_policy` | Get a single escalation policy by ID. Includes escalation layers, repeat settings, and reassignment targets. | id |
| `create_escalation_policy` | Create a new escalation policy. Escalation policies define how alerts move through on-call layers when no one acknowledges. | name, repeat, reassign_team_ids, reassign_account_user_ids, escalation_layers_attributes |
| `update_escalation_policy` | Update an existing escalation policy. Only send fields you want to change - omitted fields are left as-is. | id, name, repeat, reassign_team_ids, reassign_account_user_ids, escalation_layers_attributes |
| `delete_escalation_policy` | Permanently delete an escalation policy. Cannot be undone. | id |

### Events

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_events` | List all on-call events. Events are the building blocks of on-call schedules - they define who is on-call, when, and for which escalation layer. | limit, offset, page, sort, direction |
| `get_event` | Get a single on-call event by ID. Returns the raw event definition including attendees, schedule assignments, repeat/rotation settings, and exceptions. | id |
| `create_event` | Create a new on-call event and add it to a schedule. | start_time, end_time, layer, time_zone, account_user_ids, schedule_ids, repeat, frequency, frequency_unit, days_of_week, repeat_end_datetime, rotation |
| `update_event` | Update an existing on-call event. Only send fields you want to change - omitted fields are left as-is. | id, start_time, end_time, layer, time_zone, account_user_ids, schedule_ids, repeat, frequency, frequency_unit, days_of_week, repeat_end_datetime, rotation |
| `delete_event` | Permanently delete an on-call event and ALL its occurrences. Cannot be undone. | id |
| `override_event` | Override a single occurrence of an on-call event with different attendees and/or times. Handles breaking up the event just like the UI - the original event is split around the override. | id, start_time, end_time, layer, time_zone, account_user_ids, action_time |
| `terminate_event` | End a repeating event series from a specific occurrence onward. Deletes the specified occurrence and all future occurrences, leaving past occurrences intact. | id, action_time |
| `add_event_exception` | Skip a single occurrence of a repeating event without affecting the rest of the series. The occurrence is removed from the schedule but all other occurrences remain. | id, action_time |
| `list_event_time_zones` | List all valid timezone names supported by PagerTree for use in event time_zone fields. | - |

### Integrations

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_integrations` | List all integrations. Integrations connect PagerTree to 3rd party tools and are responsible for creating alerts. | limit, offset, page, sort, direction |
| `get_integration` | Get a single integration by ID. Includes enabled status, urgency, integration type, webhook URL, and routing destinations. | id |
| `create_integration` | Create a new integration. Integrations connect PagerTree to 3rd party tools and create alerts when triggered. | name, urgency, integration_type_id, enabled, team_ids, router_ids, account_user_ids, options |
| `update_integration` | Update an existing integration. Only send fields you want to change - omitted fields are left as-is. | id, name, urgency, enabled, team_ids, router_ids, account_user_ids, options |
| `delete_integration` | Permanently delete an integration. Cannot be undone. | id |
| `enable_integration` | Enable an integration so it can receive webhook requests and create alerts. | id |
| `disable_integration` | Disable an integration so it stops receiving webhook requests and creating alerts. The integration and its webhook URL are preserved and can be re-enabled later. | id |
| `list_integration_types` | List all available integration types. Integration types define the 3rd party tools PagerTree can connect to (e.g. Datadog, PagerDuty, email, webhook). | limit, offset, page, sort, direction |
| `get_integration_type` | Get a single integration type by ID. Includes the name, description, and `meta.documentation_url`. | id |

### Logs

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_logs` | List logs, optionally filtered by owner. Logs are polymorphic and can be attached to any object in PagerTree (alerts, integrations, schedules, etc). | owner_id, owner_type, limit, offset, page, sort, direction |
| `get_log` | Get a single log by ID. Logs record activity and state changes for objects in PagerTree. | id |

### Maintenance Windows

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_maintenance_windows` | List all maintenance windows. Maintenance windows suppress alerts from specified integrations during a defined time period - useful for planned outages or deployments. | limit, offset, page, sort, direction |
| `get_maintenance_window` | Get a single maintenance window by ID. Includes name, start/end times, timezone, description, and affected integrations. | id |
| `create_maintenance_window` | Create a new maintenance window. During the window, incoming requests from the specified integrations will be suppressed and no alerts will be created. | name, start_datetime, end_datetime, time_zone, integration_ids, description |
| `update_maintenance_window` | Update an existing maintenance window. Only provide the fields you want to change. | id, name, start_datetime, end_datetime, time_zone, integration_ids, description |
| `delete_maintenance_window` | Permanently delete a maintenance window. Cannot be undone. | id |

### Notification Rules

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_notification_rules` | List all notification rules. Notification rules are YAML configurations that define custom notification sequences for account users. | limit, offset, page, sort, direction |
| `get_notification_rule` | Get a single notification rule by ID. Includes name, enabled status, and the YAML rules definition. | id |
| `create_notification_rule` | Create a new notification rule. Notification rules are YAML configurations that define custom notification sequences for account users when an alert is opened. | name, enabled, rules |
| `update_notification_rule` | Update an existing notification rule. Only send fields you want to change - omitted fields are left as-is. | id, name, enabled, rules |
| `delete_notification_rule` | Permanently delete a notification rule. Cannot be undone. | id |

### Routers

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_routers` | List all routers. Routers are YAML configurations that dynamically route and transform alerts based on match conditions - processed after an integration creates an alert but before it is assigned to a team. | limit, offset, page, sort, direction |
| `get_router` | Get a single router by ID. Includes YAML rules, enabled status, and default receiver configuration. | id |
| `create_router` | Create a new router. Routers use YAML rules to dynamically route and transform alerts based on match conditions. | name, default_receiver_team_id, default_receiver_account_user_id, default_receiver_router_id, enabled, rules |
| `update_router` | Update an existing router. Only send fields you want to change - omitted fields are left as-is. | id, name, enabled, rules, default_receiver_team_id, default_receiver_account_user_id, default_receiver_router_id |
| `delete_router` | Permanently delete a router. Cannot be undone. | id |

### Schedules

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_schedules` | List all on-call schedules. Schedules are composed of calendar events that define who is on-call, when, and for which escalation layer. | limit, offset, page, sort, direction |
| `get_schedule` | Get a single on-call schedule by ID. Includes name and associated team. | id |
| `create_schedule` | Create a new on-call schedule. | name |
| `update_schedule` | Update an existing schedule. Currently only the name can be updated. | id, name |
| `delete_schedule` | Permanently delete a schedule and all its events. Cannot be undone. | id |
| `flush_schedule` | Remove all events from a schedule. The schedule itself is preserved but all on-call events are permanently deleted. Cannot be undone. | id |
| `get_schedule_current_oncall` | Get who is currently on-call for a schedule. Returns the processed on-call event attendees for right now, correctly handling repeating events, rotations, overrides, and exceptions. | id |
| `get_schedule_window_events` | Return processed on-call event attendees for a specified time window. Correctly handles repeating events, rotations, overrides, and exceptions. Use this to answer "who is on-call next week?" type questions. | id, start, end |
| `get_schedule_events` | Return raw event definitions assigned to a schedule. Does not process repeating events, rotations, overrides, or exceptions - returns the unprocessed event records as stored. | id |

### Teams

| Tool | Description | Parameters |
| --- | --- | --- |
| `list_teams` | List all teams. Teams are the primary organizational unit in PagerTree - they group account users together and have an associated schedule and escalation policy for managing on-call and alert routing. | limit, offset, page, sort, direction |
| `get_team` | Get a single team by ID. Includes members, admins, active schedule_id, active escalation_policy_id, notification settings, and notes. | id |
| `create_team` | Create a new team. | name, member_account_user_ids, admin_account_user_ids, notes, drop_notifications, handoff_notifications, drop_notification_account_user_ids, handoff_notification_account_user_ids |
| `update_team` | Update an existing team. Only send fields you want to change - omitted fields are left as-is. | id, name, notes, escalation_policy_id, schedule_id, member_account_user_ids, admin_account_user_ids, drop_notifications, handoff_notifications, drop_notification_account_user_ids, handoff_notification_account_user_ids |
| `delete_team` | Permanently delete a team. Cannot be undone. | id |
| `get_current_oncall` | Get who is currently on-call for a team. Returns processed on-call event attendees for right now, correctly handling repeating events, rotations, overrides, and exceptions. | team_id |
| `list_team_alerts` | List alerts that have been assigned to a specific team. | id, limit, offset, page, sort, direction |

## License

MIT
