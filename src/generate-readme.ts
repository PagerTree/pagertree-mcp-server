import { readFileSync, writeFileSync } from "fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAllTools } from "./tools/index.js";

const server = new McpServer({ name: "pagertree", version: "0.1.0" });
registerAllTools(server);

const tools = (server as unknown as { _registeredTools: Record<string, { description: string; inputSchema: { shape: Record<string, unknown> } }> })._registeredTools;

const groups: Record<string, string[]> = {
  "Account Users": ["list_account_users", "get_account_user", "create_account_user", "update_account_user", "delete_account_user"],
  "Alerts": ["list_alerts", "get_alert", "create_alert", "update_alert", "delete_alert", "acknowledge_alert", "reject_alert", "resolve_alert", "list_alert_comments", "create_alert_comment"],
  "Broadcasts": ["list_broadcasts", "get_broadcast", "create_broadcast", "update_broadcast", "delete_broadcast", "list_broadcast_comments", "create_broadcast_comment"],
  "Escalation Policies": ["list_escalation_policies", "get_escalation_policy", "create_escalation_policy", "update_escalation_policy", "delete_escalation_policy"],
  "Events": ["list_events", "get_event", "create_event", "update_event", "delete_event", "override_event", "terminate_event", "add_event_exception", "list_event_time_zones"],
  "Integrations": ["list_integrations", "get_integration", "create_integration", "update_integration", "delete_integration", "enable_integration", "disable_integration", "list_integration_types", "get_integration_type"],
  "Logs": ["list_logs", "get_log"],
  "Maintenance Windows": ["list_maintenance_windows", "get_maintenance_window", "create_maintenance_window", "update_maintenance_window", "delete_maintenance_window"],
  "Notification Rules": ["list_notification_rules", "get_notification_rule", "create_notification_rule", "update_notification_rule", "delete_notification_rule"],
  "Routers": ["list_routers", "get_router", "create_router", "update_router", "delete_router"],
  "Schedules": ["list_schedules", "get_schedule", "create_schedule", "update_schedule", "delete_schedule", "flush_schedule", "get_schedule_current_oncall", "get_schedule_window_events", "get_schedule_events"],
  "Teams": ["list_teams", "get_team", "create_team", "update_team", "delete_team", "get_current_oncall", "list_team_alerts"],
};

const tableHeader = `| Tool | Description | Parameters |\n| --- | --- | --- |`;

const toolRows = Object.entries(groups).map(([group, toolNames]) => {
  const rows = toolNames.map(name => {
    const tool = tools[name];
    if (!tool) return null;
    const params = Object.keys(tool.inputSchema?.shape ?? {}).join(", ");
    const description = (tool.description ?? "").split("\n")[0].trim();
    return `| \`${name}\` | ${description} | ${params || "-"} |`;
  }).filter(Boolean).join("\n");

  return `### ${group}\n\n${tableHeader}\n${rows}`;
}).join("\n\n");

const template = readFileSync("README.template.md", "utf-8");
const readme = template.replace("{{TOOLS_TABLE}}", toolRows);
writeFileSync("README.md", readme);
console.log("README.md generated successfully");