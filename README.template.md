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
{{TOOLS_TABLE}}

## License

MIT
