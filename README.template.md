# PagerTree MCP Server

MCP server for [PagerTree](https://pagertree.com) - incident management and on-call alerting.

## Installation

First, pull the Docker image:

```bash
docker pull ghcr.io/pagertree/pagertree-mcp-server:latest
```

Then configure your MCP client. Find your API token in your [PagerTree account settings](https://app.pagertree.com/user/api-tokens).

### Claude Desktop

Add to your `claude_desktop_config.json` (see [Anthropic's MCP quickstart](https://modelcontextprotocol.io/quickstart/user) to locate this file):

```json
{
  "mcpServers": {
    "pagertree": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "PAGERTREE_API_TOKEN=your-api-token-here",
        "-e", "PAGERTREE_READ_ONLY=false",
        "ghcr.io/pagertree/pagertree-mcp-server:latest"
      ]
    }
  }
}
```

### Windows (WSL2)

If you're running Docker inside WSL2, use `wsl.exe` to bridge from Windows to your WSL2 Docker installation. Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pagertree": {
      "command": "C:\\WINDOWS\\system32\\wsl.exe",
      "args": [
        "--",
        "/snap/bin/docker",
        "run", "--rm", "-i",
        "-e", "PAGERTREE_API_TOKEN=your-api-token-here",
        "-e", "PAGERTREE_READ_ONLY=false",
        "ghcr.io/pagertree/pagertree-mcp-server:latest"
      ]
    }
  }
}
```

> **Note**: The Docker path `/snap/bin/docker` is common for Docker installed via Snap on Ubuntu WSL2. Run `which docker` inside WSL2 to confirm your path and update accordingly.

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "pagertree": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "PAGERTREE_API_TOKEN=your-api-token-here",
        "-e", "PAGERTREE_READ_ONLY=false",
        "ghcr.io/pagertree/pagertree-mcp-server:latest"
      ]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "pagertree": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "PAGERTREE_API_TOKEN=your-api-token-here",
        "-e", "PAGERTREE_READ_ONLY=false",
        "ghcr.io/pagertree/pagertree-mcp-server:latest"
      ]
    }
  }
}
```

### VS Code

Add to your [user settings](https://code.visualstudio.com/docs/configure/settings#_settings-json-file) or `.vscode/mcp.json` in your workspace:

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "pagertree_api_token",
        "description": "PagerTree API Token",
        "password": true
      }
    ],
    "servers": {
      "pagertree": {
        "command": "docker",
        "args": [
          "run", "--rm", "-i",
          "-e", "PAGERTREE_API_TOKEN=${input:pagertree_api_token}",
          "ghcr.io/pagertree/pagertree-mcp-server:latest"
        ]
      }
    }
  }
}
```

See [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

### Zed

Add to `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "pagertree": {
      "command": {
        "path": "docker",
        "args": [
          "run", "--rm", "-i",
          "-e", "PAGERTREE_API_TOKEN=your-api-token-here",
          "ghcr.io/pagertree/pagertree-mcp-server:latest"
        ],
        "env": {}
      },
      "settings": {}
    }
  }
}
```

### Claude Code

```bash
claude mcp add pagertree -- docker run --rm -i -e PAGERTREE_API_TOKEN=your-api-token-here ghcr.io/pagertree/pagertree-mcp-server:latest
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PAGERTREE_API_TOKEN` | Yes | - | Your PagerTree API token. Find it in your [PagerTree account settings](https://app.pagertree.com/user/api-tokens). |
| `PAGERTREE_READ_ONLY` | No | `true` | Run in read-only mode. Only list/get tools are available. Set to `false` to enable write operations. |
| `PAGERTREE_API_URL` | No | `https://api.pagertree.com/api/v4` | Override the API base URL. |

> **Important**: The server runs in **read-only mode by default** for safety. Write operations (create, update, delete, acknowledge, resolve, etc.) are disabled unless you explicitly set `PAGERTREE_READ_ONLY=false`. Use with caution.

## Available Tools

{{TOOLS_TABLE}}

## License

MIT