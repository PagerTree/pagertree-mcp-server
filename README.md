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
| `disable_integration` | Disable an integration so it stops receiving webhooks and creating alerts. | id |
| `enable_integration` | Enable an integration so it can receive webhooks and create alerts. | id |
| `get_account_user` | Get a single account user by ID. Includes roles, notification rule, and associated user details. | id |
| `get_alert` | Get a single alert by ID | id |
| `get_current_oncall` | Get who is currently on-call for a team. Returns the on-call event attendees for right now, handling repeating events and rotations. | team_id |
| `get_integration` | Get a single integration by ID. Includes enabled status, urgency, integration type, and routing destinations. | id |
| `get_log` | Get a single log by ID | id |
| `get_user` | Get a single user by ID. Includes emails and phone numbers. | id |
| `list_account_users` | List all account users. An account user represents a user associated with this account, including their roles and notification rules. | limit, offset, page, sort, direction |
| `list_alerts` | List alerts with pagination and filtering. Returns data, has_more, and total_count. | status, limit, offset, page, sort, direction |
| `list_integrations` | List all integrations. Integrations connect PagerTree to 3rd party applications and are responsible for creating alerts. | limit, offset, page, sort, direction |
| `list_logs` | List logs, optionally filtered by owner. Logs are polymorphic and can be attached to any object (alerts, schedules, etc). | owner_id, owner_type, limit, offset, page, sort, direction |
| `list_schedules` | List all on-call schedules | - |
| `list_teams` | List all teams | - |
| `list_users` | List all users. Users represent physical people and include their emails and phone numbers. | limit, offset, page, sort, direction |

## License

MIT
