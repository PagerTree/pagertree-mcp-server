#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";

const server = new McpServer(
  {
    name: "pagertree",
    version: "0.1.0",
  },
  {
    instructions: `You are connected to PagerTree, an incident management and on-call alerting platform.

## ID Format
All PagerTree IDs are ULIDs (Universally Unique Lexicographically Sortable Identifiers).
ULIDs are time-sortable, so sorting by \`id\` asc/desc is always equivalent to sorting by \`created_at\` asc/desc and is preferred.
Never sort by \`created_at\` - always use \`id\` instead.

## ID Lookup Flexibility
For GET requests, three ID formats are interchangeable:
- ULID e.g. \`01KV5YNDYM25RR9JAWMNKZPZZZ\`
- Tiny ID e.g. \`123\`
- Prefix ID e.g. \`alt_xxxxxxxxxxxxxxxxxxxx\`

Examples: \`GET /alerts/123\`, \`GET /alerts/alt_xxxx\`, \`GET /alerts/01KV5...\` all work.

For POST/PUT request bodies, always use the full ULID - tiny_id and prefix_id are not accepted.

## Pagination
All list endpoints return \`data\`, \`has_more\`, and \`total_count\`.
Use \`page\` or \`offset\` + \`limit\` to paginate through results.
Default limit is 10. Maximum is 100.

## IDs in Parameters
When a tool requires an ID (e.g. \`team_id\`, \`account_user_id\`), use the corresponding list tool first to find the correct ID before calling the write tool.
If a user provides a tiny_id or prefix_id in conversation, you can use it directly for GET lookups but must resolve the ULID first before using it in a POST/PUT body.

## Teams, Schedules, and Escalation Policies
When a team is created, PagerTree automatically creates:
- A default **Schedule** for managing on-call events
- A default **Escalation Policy** for alert escalation

Workflow for modifying a team's on-call setup:
1. \`get_team\` → find the team's \`schedule_id\` and \`escalation_policy_id\`
2. \`get_schedule\` / \`get_escalation_policy\` → inspect current configuration
3. \`update_schedule\` / \`update_escalation_policy\` → make changes

Avoid creating standalone schedules or escalation policies unless you specifically need multiple per team. Always check the team first.`,
  }
);

registerAllTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);